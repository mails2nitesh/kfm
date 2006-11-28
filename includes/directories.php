<?php
function _add_directory_to_db($name,$physical_address,$parent){
	global $db;
	$physical_address = str_replace('//','/', $physical_address);
	$sql='insert into directories (name,physical_address,parent) values("'.addslashes($name).'","'.addslashes($physical_address).'",'.$parent.')';
	return $db->exec($sql);
}
function _createDirectory($parent,$name){
	$dirdata=_getDirectoryDbInfo($parent);
	if(!count($dirdata))return 'error: no data for directory id "'.$parent.'"'; # TODO: new string
	$physical_address=$dirdata['physical_address'].'/'.$name;
	$short_version=str_replace($GLOBALS['rootdir'],'',$physical_address);
	if(!kfm_checkAddr($physical_address))return 'error: illegal directory name "'.$short_version.'"'; # TODO: new string
	if(file_exists($physical_address))return 'error: a directory named "'.$short_version.'" already exists'; # TODO: new string
	mkdir($physical_address);
	if(!file_exists($physical_address))return 'error: failed to create directory "'.$short_version.'". please check permissions'; # TODO: new string
	kfm_add_directory_to_db($name,$physical_address,$parent);
	return kfm_loadDirectories($parent);
}
function _deleteDirectory($id,$recursive=0){
	global $db;
	$dirdata=_getDirectoryDbInfo($id);
	if(!count($dirdata))return array('type'=>'error','msg'=>4); # directory not in database
	$abs_dir=$dirdata['physical_address'];
	$directory=str_replace($GLOBALS['rootdir'],'',$abs_dir);
	if(!kfm_checkAddr($directory))return array('type'=>'error','msg'=>1,'name'=>$directory); # illegal name
	if(!$recursive){
		$ok=1;
		if($handle=opendir($abs_dir))while(false!==($file=readdir($handle)))if(strpos($file,'.')!==0)$ok=0;
		if(!$ok)return array('type'=>'error','msg'=>2,'name'=>$directory,'id'=>$id); # directory not empty
	}
	kfm_rmdir2($id);
	if(file_exists($abs_dir))return array('type'=>'error','msg'=>3,'name'=>$directory);
	$parent=strpos($directory,'/')>0?preg_replace('/\/[^\/]*$/','',$directory):'';
	return kfm_loadDirectories($parent);
}
function _getDirectoryDbInfo($id){
	$q=$GLOBALS['db']->query('select * from directories where id='.$id);
	return $q->fetchRow();
}
function _getDirectoryProperties($dir){
	if(strlen($dir))$properties=kfm_getDirectoryProperties(preg_replace('/[^\/]*\/$/','',$dir));
	else $properties=array('allowed_file_extensions'=>array());
	$full_dir=$GLOBALS['rootdir'].$dir.'/.directory_properties';
	if(!is_dir($full_dir)&&is_writable($full_dir))mkdir($full_dir);
	else{
		if(file_exists($full_dir.'/allowed_file_extensions'))$properties['allowed_file_extensions']=kfm_getFileAsArray($full_dir.'/allowed_file_extensions');
	}
	return $properties;
}
function _loadDirectories($root){
	global $db;
	if(is_numeric($root)){
		$rootid=$root;
		$dirdata=_getDirectoryDbInfo($rootid);
		$reqdir=count($dirdata)?$dirdata['physical_address'].'/':$GLOBALS['rootdir'];
		$root=str_replace($GLOBALS['rootdir'],'',$reqdir);
	}
	if(!isset($rootid)){
		$reqdir=str_replace('//','/',$GLOBALS['rootdir'].$root);
		$q=$db->query('select id from directories where physical_address="'.addslashes($reqdir).'"');
		$r=$q->fetchRow();
		$rootid=$r['id'];
	}
	if(!kfm_checkAddr($root))return 'error: illegal address "'.$root.'"';
	if(!is_dir($reqdir))mkdir($reqdir,0755);
	if($handle=opendir($reqdir)){
		$q=$db->query('select id,name from directories where parent="'.$rootid.'"');
		$dirsdb=$q->fetchAll();
		$dirshash=array();
		if(is_array($dirsdb))foreach($dirsdb as $r)$dirshash[$r['name']]=$r['id'];
		$directories=array();
		while(false!==($file=readdir($handle))){
			$ff1=$reqdir.$file;
			if(is_dir($ff1)&&strpos($file,'.')!==0){
				$directory=array($file,0);
				if($h2=opendir($ff1)){ # see if the directory has any sub-directories
					while(false!==($file3=readdir($h2))){
						if(is_dir($ff1.'/'.$file3)&&strpos($file3,'.')!==0)$directory[1]++;
					}
				}
				if(!isset($dirshash[$file])){
					kfm_add_directory_to_db($file,$ff1,$rootid);
					$dirshash[$file]=$db->lastInsertId();
				}
				$directories[]=array($file,$directory[1],$dirshash[$file]);
			}
		}
		closedir($handle);
		sort($directories);
		return array('parent'=>$rootid,'reqdir'=>$root,'directories'=>$directories,'properties'=>kfm_getDirectoryProperties($root.'/'));
	}
	return 'couldn\'t read directory "'.$reqdir.'"';
}
function _moveDirectory($from,$to){
	global $db;
	$f_r=_getDirectoryDbInfo($from);
	$t_r=_getDirectoryDbInfo($to);
	$f_add=$f_r['physical_address'];
	$f_name=$f_r['name'];
	$t_add=$t_r['physical_address'];
	if(strpos($t_add,$f_add)===0)return 'error: cannot move a directory into its own sub-directory'; # TODO: new string
	if(file_exists($t_add.'/'.$f_name))return 'error: "'.$t_add.'/'.$f_name.'" already exists'; # TODO: new string
	rename($f_add,$t_add.'/'.$f_name);
	if(!file_exists($t_add.'/'.$f_name))return 'error: could not move directory'; # TODO: new string
	$len=strlen(preg_replace('#/[^/]*$#','',$f_add));
	if($GLOBALS['kfm_db_type']=='sqlite')$fugly='update directories set physical_address=("'.addslashes($t_add).'"||substr(physical_address,'.($len+1).',length(physical_address)-'.$len.')) where physical_address like "'.addslashes($f_add).'/%" or id='.$from;
	else $fugly='update directories set physical_address=concat("'.addslashes($t_add).'",substr(physical_address,'.$len.'-length(physical_address))) where physical_address like "'.addslashes($f_add).'/%" or id='.$from;
	$db->exec($fugly) or die('error: '.print_r($db->errorInfo(),true));
	$db->exec('update directories set parent="'.$to.'" where id='.$from) or die('error: '.print_r($db->errorInfo(),true));
	return _loadDirectories(1);
}
function _rmdir2($dir){ # adapted from http://php.net/rmdir
	if(is_numeric($dir)&&$dir!=0){
		global $db;
		$dirdata=_getDirectoryDbInfo($dir);
		$dir=$dirdata['physical_address'];
	}
	if(substr($dir,-1,1)=="/")$dir=substr($dir,0,strlen($dir)-1);
	if($handle=opendir($dir)){
		while(false!==($item=readdir($handle))){
			if($item!='.'&&$item!='..'){
				$uri=$dir.'/'.$item;
				if(is_dir($uri))kfm_rmdir2($uri);
				else unlink($uri);
			}
		}
		closedir($handle);
		rmdir($dir);
	}
	if(isset($dirdata)){
		{ # sqlite doesn't honour referential integrity, so files need to be manually removed.
			$q=$db->query('select id from directories where physical_address like "'.$dirdata['physical_address'].'%"');
			$dirs=$q->fetchAll();
			foreach($dirs as $dir)$db->exec('delete from files where parent="'.$dir['id'].'"');
		}
		$db->exec('delete from directories where physical_address like "'.$dirdata['physical_address'].'%"');
	}
}
?>
