<?php
function _createDirectory($parent,$name){
	global $kfm_allow_directory_create;
	if(!$kfm_allow_directory_create)return 'error: '.kfm_lang('permissionDeniedCreateDirectory');
	$dir=kfmDirectory::getInstance($parent);
	$dir->createSubdir($name);
	if($dir->hasErrors()) return $dir->getErrors();
	return kfm_loadDirectories($parent);
}
function _deleteDirectory($id,$recursive=0){
	global $kfm_allow_directory_delete;
	if(!$kfm_allow_directory_delete)return 'error: '.kfm_lang('permissionDeniedDeleteDirectory');
	$dir=kfmDirectory::getInstance($id);
	$dir->delete();
	if($dir->hasErrors()) return $dir->getErrors();
	return kfm_loadDirectories($dir->pid,$id);
}
function _getDirectoryDbInfo($id){
	global $kfmdb;
	if(!isset($_GLOBALS['cache_directories'][$id])){
		$_GLOBALS['cache_directories'][$id]=db_fetch_row("select * from ".KFM_DB_PREFIX."directories where id=".$id);
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
	global $kfmdb, $kfm_banned_folders;
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
	if(!$kfm_allow_directory_move)return 'error: '.kfm_lang('permissionDeniedMoveDirectory');
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
	if(!$kfm_allow_directory_edit)return 'error: '.kfm_lang('permissionDeniedEditDirectory');
	$dir=kfmDirectory::getInstance($fid);
	$dir->rename($newname);
	if($dir->hasErrors())return $dir->getErrors();
	return _loadDirectories($dir->pid);
}
function _rmdir($pid){
	/* this function should be...
	 * $dir = new kfmDirectory($pid);
	 * $dir->delete();
	 * return array('errors'=>kfm_getErrors());
	 * or
	 * if(!$dir->delete())return array('errors'=>kfm_getErrors());
	 */
	global $kfmdb;
	{ # remove db entries
		$files=db_fetch_all("select id from ".KFM_DB_PREFIX."files where directory=".$pid);
		foreach($files as $r){
			$f=kfmFile::getInstance($r['id']);
			$f->delete();
		}
		$dirs=db_fetch_all("select id from ".KFM_DB_PREFIX."directories where parent=".$pid);
		foreach($dirs as $r)_rmdir($r['id']);
	}
	_recursivelyRemoveDirectory(_getDirectoryParents($pid));
	$kfmdb->exec("delete from ".KFM_DB_PREFIX."directories where id=".$pid);
}
function kfm_rmMixed($files=array(), $directories=array()){
	$filecount=0;
	$dircount=0;
	foreach($files as $fid){
		$file=new kfmFile($fid);
		if($file->delete())$filecount++;
	}
	foreach($directories as $did){
		$dir=new kfmDirectory($did);
		if($dir->delete())$dircount++;
	}
}	
?>
