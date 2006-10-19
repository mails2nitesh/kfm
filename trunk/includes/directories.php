<?php
function _add_directory_to_db($name,$physical_address,$parent){
	global $db,$db_method;
	$physical_address = str_replace('//','/', $physical_address);
	$sql='insert into directories (name,physical_address,parent) values("'.addslashes($name).'","'.addslashes($physical_address).'",'.$parent.')';
#	if($db_method=='sqlite'&&$db->getAttribute(PDO::ATTR_SERVER_VERSION)<'3.3'){ # sqlite only supports autoincrement recently
#		$q=$db->prepare('select id from directories limit 1');
#		$id=$q->execute()?'(select id from directories order by id desc limit 1)+1':1;
#		$sql='insert into directories (id,name,physical_address,parent) values('.$id.',"'.addslashes($name).'","'.addslashes($physical_address).'",'.$parent.')';
#	}
	$q=$db->prepare($sql);
	return $q->execute();
}
function _createDirectory($parent,$name){
	global $db;
	$q=$db->prepare('select id,physical_address,name from directories where id='.$parent);
	$q->execute();
	if(!($dirdata=$q->fetch()))return 'error: no data for directory id "'.$parent.'"'; # TODO: new string
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
	$qd=$db->prepare('SELECT * FROM directories WHERE id="'.$id.'"');
	$qd->execute();
	$dirdata=$qd->fetch();
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
		$q=$db->prepare('select id,physical_address,name from directories where id='.$rootid);
		$q->execute();
		$dirdata=$q->fetch();
		$reqdir=count($dirdata)?$dirdata['physical_address'].'/':$GLOBALS['rootdir'];
		$root=str_replace($GLOBALS['rootdir'],'',$reqdir);
	}
	if(!isset($rootid)){
		$reqdir=str_replace('//','/',$GLOBALS['rootdir'].$root);
		$q=$db->prepare('select id from directories where physical_address="'.addslashes($reqdir).'"');
		$q->execute();
		$r=$q->fetch();
		$rootid=$r['id'];
	}
	if(!kfm_checkAddr($root))return 'error: illegal address "'.$root.'"';
	if(!is_dir($reqdir))mkdir($reqdir,0755);
	if($handle=opendir($reqdir)){
		$q=$db->prepare('select id,name from directories where parent="'.$rootid.'"');
		$q->execute();
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
	$q=$db->query('select * from directories where id="'.$from.'"');
	$from=$q->fetch();
	$q=$db->query('select * from directories where id="'.$to.'"');
	$to=$q->fetch();
	if(strpos($to['physical_address'],$from['physical_address'])===0)return 'error: cannot move a directory into its own sub-directory'; # TODO: new string
	if(file_exists($to['physical_address'].'/'.$from['name']))return 'error: "'.$to['physical_address'].'/'.$from['name'].'" already exists'; # TODO: new string
	rename($from['physical_address'],$to['physical_address'].'/'.$from['name']);
	if(!file_exists($to['physical_address'].'/'.$from['name']))return 'error: could not move directory'; # TODO: new string
	$len=strlen(preg_replace('#/[^/]*$#','',$from['physical_address']));
	$fugly='update directories set physical_address=("'.addslashes($to['physical_address']).'"||substr(physical_address,'.($len+1).',length(physical_address)-'.($len).')) where physical_address like "'.addslashes($from['physical_address']).'/%" or id="'.$from['id'].'"';
	$db->query($fugly);
	$db->query('update directories set parent="'.$to['id'].'" where id="'.$from['id'].'"');
	return _loadDirectories(1);
}
function _rmdir2($dir){ # adapted from http://php.net/rmdir
	if(is_numeric($dir)&&$dir!=0){
		global $db;
		$qd=$db->prepare('SELECT * FROM directories WHERE id="'.$dir.'"');
		$qd->execute();
		$dirdata=$qd->fetch();
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
		{ # sqlite doesn't appear to honour referential integrity, so files need to be manually removed.
			# BTK, if your API supports referential integrity (ie, removing a directory will automatically remove files linked to it),
			#   then you can if() around this using the $db_method variable.
			$q=$db->prepare('select id from directories where physical_address like "'.$dirdata['physical_address'].'%"');
			$q->execute();
			$dirs=$q->fetchAll();
			foreach($dirs as $dir)$db->exec('delete from files where parent="'.$dir['id'].'"');
		}
		$db->exec('delete from directories where physical_address like "'.$dirdata['physical_address'].'%"');
	}
}
?>
