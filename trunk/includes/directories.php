<?php
function _createDirectory($parent,$name){
	global $kfm_allow_directory_create;
	if(!$kfm_allow_directory_create)return 'error: permission denied: cannot create directory'; # TODO: new string
	$dir=kfmDirectory::getInstance($parent);
	$dir->createSubdir($name);
	if($dir->hasErrors()) return $dir->getErrors();
	return kfm_loadDirectories($parent);
}
function _deleteDirectory($id,$recursive=0){
	global $kfm_allow_directory_delete;
	if(!$kfm_allow_directory_delete)return 'error: permission denied: cannot delete directory'; # TODO: new string
	$dir=kfmDirectory::getInstance($id);
	$dir->delete();
	if($dir->hasErrors()) return $dir->getErrors();
	return kfm_loadDirectories($dir->pid,$id);
}
function _getDirectoryDbInfo($id){
	global $kfmdb,$kfm_db_prefix;
	if(!isset($_GLOBALS['cache_directories'][$id])){
		$q=$kfmdb->query("select * from ".$kfm_db_prefix."directories where id=".$id);
		$_GLOBALS['cache_directories'][$id]=$q->fetchRow();
	}
	return $_GLOBALS['cache_directories'][$id];
}
function _getDirectoryParents($pid,$type=1){
	# type is 1:absolute, 2:relative to domain
	if($pid<2)return $GLOBALS['rootdir'];
	$db=_getDirectoryDbInfo($pid);
	return _getDirectoryParents($db['parent'],$type).$db['name'].'/';
}
function _loadDirectories($pid,$oldpid=0){
	global $kfmdb,$kfm_db_prefix, $kfm_banned_folders;
	$dir=kfmDirectory::getInstance($pid);
	$pdir=str_replace($GLOBALS['rootdir'],'',$dir->path);
	$directories=array();
	foreach($dir->getSubdirs() as $subDir)$directories[]=array($subDir->name,$subDir->hasSubdirs(),$subDir->id);
	sort($directories);
	return array(
		'parent'=>$pid,
		'oldpid'=>$oldpid,
		'reqdir'=>$pdir,
		'directories'=>$directories,
		'properties'=>$dir->getProperties()
	);
}
function _moveDirectory($from,$to){
	global $kfm_allow_directory_move;
	if(!$kfm_allow_directory_move)return 'error: permission denied: cannot move directory'; # TODO: new string
	$dir=kfmDirectory::getInstance($from);
	$dir->moveTo($to);
	if($dir->hasErrors()) return $dir->getErrors();
	return _loadDirectories(1);
}
function _recursivelyRemoveDirectory($dir){
	if($handle=opendir($dir)){
		while(false!==($item=readdir($handle))){
			if($item!='.'&&$item!='..'){
				$uri=$dir.'/'.$item;
				if(is_dir($uri))_recursivelyRemoveDirectory($uri);
				else unlink($uri);
			}
		}
		closedir($handle);
		rmdir($dir);
	}
}
function _renameDirectory($fid,$newname){
	global $kfm_allow_directory_edit;
	if(!$kfm_allow_directory_edit)return 'error: permission denied: cannot edit directory'; # TODO: new string
	$dir=kfmDirectory::getInstance($fid);
	$dir->rename($newname);
	if($dir->hasErrors())return $dir->getErrors();
	return _loadDirectories($dir->pid);
}
function _rmdir($pid){
	global $kfmdb,$kfm_db_prefix;
	{ # remove db entries
		$q=$kfmdb->query("select id from ".$kfm_db_prefix."files where directory=".$pid);
		$files=$q->fetchAll();
		foreach($files as $r){
			$f=new File($r['id']);
			$f->delete();
		}
		$q=$kfmdb->query("select id from ".$kfm_db_prefix."directories where parent=".$pid);
		$dirs=$q->fetchAll();
		foreach($dirs as $r)_rmdir($r['id']);
	}
	_recursivelyRemoveDirectory(_getDirectoryParents($pid));
	$kfmdb->exec("delete from ".$kfm_db_prefix."directories where id=".$pid);
}
?>
