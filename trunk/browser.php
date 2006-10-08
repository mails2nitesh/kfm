<?php
# see license.txt for licensing
include('config.php');
{ # variables
	$kaejax_js_has_been_shown=0;
	$kaejax_export_list=array();
	$kaejax_is_loaded=strstr($_SERVER['REQUEST_URI'],'kaejax_is_loaded');
}	
function kaejax_get_js_repr($value=''){
	$type=gettype($value);
	if($type=='boolean'||$type=='integer')return 'parseInt('.$value.')';
	elseif($type=='double')return 'parseFloat('.$value.')';
	elseif($type=='array'||$type=='object'){
		if($type=='array'){
			$isNumeric=1;
			foreach(array_keys($value) as $key)if(!is_numeric($key))$isNumeric=0;
		}
		if($type=='array'&&$isNumeric){
			$arr=array();
			foreach($value as $k=>$v)$arr[]=kaejax_get_js_repr($v);
			return '['.join(',',$arr).']';
		}
		$s='';
		if($type=='object')$value=get_object_vars($value);
		foreach($value as $k=>$v){
			$esc_key=kaejax_esc($k);
			if(is_numeric($k))$s.=$k.':'.kaejax_get_js_repr($v).',';
			else $s.=$esc_key.':'.kaejax_get_js_repr($v).',';
		}
		return '('.LSQUIGG.substr($s,0,-1).RSQUIGG.')';
	} 
	else{
		$esc_val=kaejax_esc($value);
		$s='"'.utf8_encode($esc_val).'"';
		return $s;
	}
}
function kaejax_handle_client_request(){
	if(!isset($_POST['kaejax']))return;
	require_once('JSON.php');
	$json=new Services_JSON();
	$obj=$json->decode(stripslashes($_POST['kaejax']));
	$fs=$obj->c;
	if(!is_array($fs)){ # something wrong
		echo "error: unknown data sent from client.\n\n";
		print_r($_POST['kaejax']);
		exit;
	}
	$res=array();
	foreach($fs as $f)$res[]=call_user_func_array($f->f,$f->v);
	echo $json->encode($res);
	exit;
}
function kaejax_esc($val){
	return str_replace(array("\\","\r","\n",'"'),array("\\\\","\\r","\\n",'\\"'),$val);
}
function kaejax_get_one_stub($func_name){
	$a='function x_'.$func_name.'()'.LSQUIGG.'kaejax_do_call("'.$func_name.'",arguments);'.RSQUIGG.'function_urls.'.$func_name."='".$_SERVER['REQUEST_URI']."';";
	if(!$GLOBALS['kaejax_is_loaded'])$a.='kaejax_is_loaded=1;';
	$GLOBALS['kaejax_is_loaded']=1;
	return $a;
}
function kaejax_export(){
	global $kaejax_export_list;
	$n=func_num_args();
	for($i=0;$i<$n;$i++)$kaejax_export_list[]=func_get_arg($i);
}
function kaejax_get_javascript(){
	$html='';
	if(!$GLOBALS['kaejax_js_has_been_shown']&&!$GLOBALS['kaejax_is_loaded'])$GLOBALS['kaejax_js_has_been_shown']=1;
	foreach($GLOBALS['kaejax_export_list'] as $func)$html.=kaejax_get_one_stub($func);
	return $html;
}
function kfm_changeCaption($filename,$newCaption){
	include_once('functions.image.php');
	kfm_functions_image_setCaption($filename,$newCaption);
	return kfm_loadFiles($_SESSION['kfm']['cwd_id']);
}
function kfm_createDirectory($dir_id,$child){
	global $db;
	$q=$db->prepare('select id,physical_address,name from directories where id='.$dir_id);
	$q->execute();
	if(!($dirdata=$q->fetch()))return 'error: no data for directory id "'.$dir_id.'"'; # TODO: new string
	$parent=$dirdata['physical_address'].'/';
	$newdir=$parent.$child;
	$ext=str_replace($GLOBALS['rootdir'],'',$newdir);
	if(!kfm_checkAddr($newdir))return 'error: illegal directory name "'.$ext.'"';
	if(file_exists($newdir))return 'error: a directory named "'.$ext.'" already exists';
	mkdir($newdir);
	if(!file_exists($newdir))return 'error: failed to create directory "'.$ext.'". please check permissions';
	return kfm_loadDirectories($dir_id);
}
function kfm_createEmptyFile($filename){
	if(!kfm_checkAddr($_SESSION['kfm']['currentdir'].'/'.$filename))return 'error: filename not allowed';
	return(touch($_SESSION['kfm']['currentdir'].'/'.$filename))?kfm_loadFiles($_SESSION['kfm']['cwd_id']):'error: could not write file "'.$filename.'"';
}
function kfm_deleteDirectory($directory,$recursive=0){
	if(!kfm_checkAddr($directory))return array('type'=>'error','msg'=>1,'name'=>$directory); # illegal name
	$abs_dir=$GLOBALS['rootdir'].'/'.$directory;
	if(!$recursive){
		$ok=1;
		if($handle=opendir($abs_dir))while(false!==($file=readdir($handle)))if(strpos($file,'.')!==0)$ok=0;
		if(!$ok)return array('type'=>'error','msg'=>2,'name'=>$directory); # directory not empty
	}
	kfm_rmdir2($abs_dir);
	if(file_exists($abs_dir))return array('type'=>'error','msg'=>3,'name'=>$directory);
	$parent=strpos($directory,'/')>0?preg_replace('/\/[^\/]*$/','',$directory):'';
	return kfm_loadDirectories($parent);
}
function kfm_downloadFileFromUrl($url,$filename){
	if(!kfm_checkAddr($_SESSION['kfm']['currentdir'].'/'.$filename))return 'error: filename not allowed';
	if(substr($url,0,4)!='http')return 'error: url must begin with http';
	$file=file_get_contents(str_replace(' ','%20',$url));
	if(!$file)return 'error: could not download file "'.$url.'"';
	return(file_put_contents($_SESSION['kfm']['currentdir'].'/'.$filename,$file))?kfm_loadFiles($_SESSION['kfm']['cwd_id']):'error: could not write file "'.$filename.'"';
}
function kfm_moveFiles($files,$dir_id){
	global $db;
	$q=$db->prepare('select id,physical_address,name from directories where id='.$dir_id);
	$q->execute();
	if(!($dirdata=$q->fetch()))return 'error: no data for directory id "'.$dir_id.'"'; # TODO: new string
	$to=$dirdata['physical_address'].'/';
	if(!kfm_checkAddr($to))return 'error: illegal directory "'.$to.'"'; # TODO: new string
	foreach($files as $fid){
		$q=$db->prepare('select directories.physical_address as da,files.name as fn from files,directories where directories.id=files.directory and files.id='.$fid);
		$q->execute();
		if(!($filedata=$q->fetch()))return 'error: no data for file id "'.$file.'"'; # TODO: new string
		$dir=$filedata['da'];
		$file=$filedata['fn'];
		if(!kfm_checkAddr($dir.'/'.$file))return;
		rename($dir.'/'.$file,$to.'/'.$file);
		$q=$db->prepare('update files set directory='.$dir_id.' where id='.$fid);
		$q->execute();
		$icons=glob($dir.'/.files/[0-9]*x[0-9]* '.$file);
		foreach($icons as $f)unlink($f);
		if(file_exists($dir.'/.captions/'.$file)){
			if(!is_dir($to.'/.captions'))mkdir($to.'/.captions',0755);
			rename($dir.'/.captions/'.$file,$to.'/.captions/'.$file);
		}
	}
	return kfm_loadFiles($_SESSION['kfm']['cwd_id']);
}
function kfm_getCaption($dirname,$filename){
	$directory=$GLOBALS['rootdir'].'/'.$dirname.'/.captions';
	$file=$directory.'/'.$filename;
	if(!file_exists($file)){
		if(!is_dir($directory))mkdir($directory,0755);
		touch($file);
	}
	return join('',file($file));
}
function kfm_getDirectoryProperties($dir){
	if(strlen($dir))$properties=kfm_getDirectoryProperties(preg_replace('/[^\/]*\/$/','',$dir));
	else $properties=array('allowed_file_extensions'=>array());
	$full_dir=$GLOBALS['rootdir'].$dir.'/.directory_properties';
	if(!is_dir($full_dir)&&is_writable($full_dir))mkdir($full_dir);
	else{
		if(file_exists($full_dir.'/allowed_file_extensions'))$properties['allowed_file_extensions']=kfm_getFileAsArray($full_dir.'/allowed_file_extensions');
	}
	return $properties;
}
function kfm_getFileAsArray($filename){
	return explode("\n",rtrim(file_get_contents($filename)));
}
function kfm_getFileDetails($filename){
	if(!file_exists($_SESSION['kfm']['currentdir'].'/'.$filename))return;
	$mimetype=mime_content_type($_SESSION['kfm']['currentdir'].'/'.$filename);
	$details=array(
		'filename'=>$filename,
		'mimetype'=>$mimetype,
		'filesize'=>kfm_resize_bytes(filesize(addslashes($_SESSION['kfm']['currentdir'].'/'.$filename)))
	);
	switch(preg_replace('/\/.*/','',$mimetype)){
		case 'image':{
			$details['caption']=kfm_getCaption($_SESSION['kfm']['currentdirpart'],$filename);
			break;
		}
	}
	return $details;
}
function kfm_getTextFile($filename){
	if(!kfm_checkAddr($filename))return;
	if(in_array(substr($filename,strrpos($filename,'.')+1),$GLOBALS['kfm_editable_extensions'])){
		if(!is_writable($_SESSION['kfm']['currentdir'].'/'.$filename))return 'error: "'.$filename.'" is not writable'; # TODO: new string
		return array(file_get_contents($_SESSION['kfm']['currentdir'].'/'.$filename),$filename);
	}
	return 'error: "'.$filename.'" cannot be edited (restricted)'; # TODO: new string
}
function kfm_getThumbnail($root,$fileid,$width,$height){
	global $db;
	if(is_numeric($root)){
		$rootid=$root;
		$q=$db->prepare('select physical_address from directories where directories.id='.$rootid);
		$q->execute();
		$dirdata=$q->fetch();
		$reqdir=count($dirdata)?$dirdata['physical_address'].'/':$GLOBALS['rootdir'];
		$root=str_replace($GLOBALS['rootdir'],'',$reqdir);
	}
	if(is_numeric($fileid)){
		$q=$db->prepare('select name from files where id='.$fileid);
		$q->execute();
		$filedata=$q->fetch();
		$filename=$filedata['name'];
	}
	$dirname=$root.'/';
	$caption=kfm_getCaption($dirname,$filename);
	$thumbnail=$dirname.'.files/'.$width.'x'.$height.' '.$filename;
	if(!kfm_checkAddr($thumbnail))return 'error: illegal filename "'.$thumbnail.'"';
	$originalfile=$GLOBALS['rootdir'].'/'.$dirname.$filename;
	if(!file_exists($originalfile))return 'error: missing file "'.$filename.'"';
	$thumbnailurl=$GLOBALS['kfm_userfiles_output'].'/'.$thumbnail;
	$thumbnailfile=$GLOBALS['rootdir'].'/'.$thumbnail;
	$info=getimagesize($originalfile);
	if(file_exists($thumbnailfile))return array($filename,array('icon'=>$thumbnailurl,'width'=>$info[0],'height'=>$info[1],'caption'=>$caption));
	if(!$info)return 'error: "'.$filename.'" is not an image';
	$type=0;
	switch($info[2]){
		case 1: $type = 'gif'; break;
		case 2: $type = 'jpeg'; break;
		case 3: $type = 'png'; break;
	}
	if(!$type)return 'error: unknown image type for "'.$filename.'"';
	$load='imagecreatefrom'.$type;
	$save='image'.$type;
	if(!function_exists($load)||!function_exists($save))return 'server cannot handle image of type "'.$type.'"';
	$im=imagecreatetruecolor($info[0],$info[1]);
	imagecopyresized($im,$load($originalfile),0,0,0,0,$info[0],$info[1],$info[0],$info[1]);
	if($info[0]>$width||$info[1]>$height){
		$x=$width/$info[0];
		$y=$height/$info[1];
		$multiply=$x>$y?$y:$x;
		$newx=(int)$info[0]*$multiply;
		$newy=(int)$info[1]*$multiply;
		$imresized=imagecreatetruecolor($newx,$newy);
		imagecopyresampled($imresized,$im,0,0,0,0,$newx,$newy,$info[0],$info[1]);
		$im=$imresized;
		$imresized=null;
	}
	$save($im,$thumbnailfile,100);
	$im=null;
	return array($filename,array('icon'=>$thumbnailurl,'width'=>$info[0],'height'=>$info[1],'caption'=>$caption));
}
function kfm_loadDirectories($root){
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
		foreach($dirsdb as $r)$dirshash[$r['name']]=$r['id'];
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
					$db->exec('insert into directories (name,physical_address,parent) values("'.addslashes($file).'","'.addslashes($ff1).'",'.$rootid.')');
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
function kfm_loadFiles($root=1){
	global $db;
	if(is_numeric($root)){
		$rootid=$root;
		$q=$db->prepare('select id,physical_address,name from directories where id='.$rootid.'');
		$q->execute();
		$dirdata=$q->fetch();
		$reqdir=count($dirdata)?$dirdata['physical_address'].'/':$GLOBALS['rootdir'];
		$root=str_replace($GLOBALS['rootdir'],'',$reqdir);
	}
	if(!kfm_checkAddr($root))return;
	$reqdir=$GLOBALS['rootdir'].$root;
	if(!is_dir($reqdir))mkdir($reqdir,0755);
	if(!is_dir($reqdir.'/.files')&&is_writable($reqdir))mkdir($reqdir.'/.files',0755);
	if($handle=opendir($reqdir)){
		$q=$db->prepare('select id,name from files where directory="'.$rootid.'"');
		$q->execute();
		$filesdb=$q->fetchAll();
		$fileshash=array();
		foreach($filesdb as $r)$fileshash[$r['name']]=$r['id'];
		$files=array();
		while(false!==($file=readdir($handle)))if(is_file($reqdir.'/'.$file)){
			if(!isset($fileshash[$file])){
				$db->exec('insert into files (name,directory) values("'.addslashes($file).'",'.$rootid.')');
				$fileshash[$file]=$db->lastInsertId();
			}
			$files[]=array('name'=>$file,'parent'=>$rootid,'id'=>$fileshash[$file]);
		}
		closedir($handle);
		$_SESSION['kfm']=array('currentdir'=>$reqdir,'currentdirpart'=>$root,'cwd_id'=>$rootid);
		return array('reqdir'=>$root,'files'=>$files,'uploads_allowed'=>$GLOBALS['kfm_allow_file_uploads']);
	}
	return 'couldn\'t read directory';
}
function kfm_renameFile($filename,$newfilename){
	if(!kfm_checkAddr($filename)||!kfm_checkAddr($newfilename))return 'error: cannot rename "'.$filename.'" to "'.$newfilename.'"';
	$newfile=$_SESSION['kfm']['currentdir'].'/'.$newfilename;
	if(file_exists($newfile))return 'error: a file of that name already exists';
	rename($_SESSION['kfm']['currentdir'].'/'.$filename,$newfile);
	return kfm_loadFiles($_SESSION['kfm']['cwd_id']);
}
function kfm_resizeImage($filename,$width,$height){
	if(!kfm_checkAddr($filename))return;
	$icons=glob($_SESSION['kfm']['currentdir'].'/.files/[0-9]*x[0-9]* '.$filename);
	foreach($icons as $f)unlink($f);
	$originalfile=$_SESSION['kfm']['currentdir'].'/'.$filename;
	if(!file_exists($originalfile))return;
	$info=getimagesize($originalfile);
	if(!$info)return;
	$type=0;
	switch($info[2]){
		case 1: $type = 'gif'; break;
		case 2: $type = 'jpeg'; break;
		case 3: $type = 'png'; break;
	}
	if(!$type)return;
	$load='imagecreatefrom'.$type;
	$save='image'.$type;
	if(!function_exists($load)||!function_exists($save))return;
	$im=imagecreatetruecolor($info[0],$info[1]);
	imagecopyresized($im,$load($originalfile),0,0,0,0,$info[0],$info[1],$info[0],$info[1]);
	if($info[0]>$width||$info[1]>$height){
		$x=$width/$info[0];
		$y=$height/$info[1];
		$multiply=$x>$y?$y:$x;
		$newx=(int)$info[0]*$multiply;
		$newy=(int)$info[1]*$multiply;
		$imresized=imagecreatetruecolor($newx,$newy);
		imagecopyresampled($imresized,$im,0,0,0,0,$newx,$newy,$info[0],$info[1]);
		$im=$imresized;
		$imresized=null;
	}
	$save($im,$originalfile,100);
	$im=null;
	return kfm_loadFiles($_SESSION['kfm']['cwd_id']);
}
function kfm_rm($files,$no_dir=0){
	if(is_array($files)){
		foreach($files as $f)kfm_rm($f,1);
	}
	else{
		if(!kfm_checkAddr($files))return;
		if(!is_writable($_SESSION['kfm']['currentdir'].'/'.$files))return 'error: "'.$files.'" cannot be deleted'; # TODO: new string
		unlink($_SESSION['kfm']['currentdir'].'/'.$files);
	}
	return $no_dir?0:kfm_loadFiles($_SESSION['kfm']['cwd_id']);
}
function kfm_rmdir2($dir){ # adapted from http://php.net/rmdir
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
}
function kfm_rotateImage($filename,$direction){
	if(!kfm_checkAddr($filename))return;
	$icons=glob($_SESSION['kfm']['currentdir'].'/.files/[0-9]*x[0-9]* '.$filename);
	foreach($icons as $f)unlink($f);
	$info=getimagesize($_SESSION['kfm']['currentdir'].'/'.$filename);
	if($info){
		$type=0;
		switch($info[2]){
			case 1: $type = 'gif'; break;
			case 2: $type = 'jpeg'; break;
			case 3: $type = 'png'; break;
		}
		if($type){
			$load='imagecreatefrom'.$type;
			$save='image'.$type;
			if(!function_exists($load)&&!function_exists($save))return;
			$imfile=$load($_SESSION['kfm']['currentdir'].'/'.$filename);
			$im=imagecreatetruecolor($info[0],$info[1]);
			imagecopyresized($im,$imfile,0,0,0,0,$info[0],$info[1],$info[0],$info[1]);
			$im=imagerotate($im,$direction,0);
			$save($im,$_SESSION['kfm']['currentdir'].'/'.$filename,100);
		}
		return kfm_loadFiles($_SESSION['kfm']['cwd_id']);
	}
}
function kfm_resize_bytes($size){
   $count = 0;
   $format = array("B","KB","MB","GB","TB","PB","EB","ZB","YB");
   while(($size/1024)>1 && $count<8)
   {
       $size=$size/1024;
       $count++;
   }
   $return = number_format($size,0,'','.')." ".$format[$count];
   return $return;
}
function kfm_saveTextFile($filename,$text){
	if(kfm_checkAddr($filename))file_put_contents($_SESSION['kfm']['currentdir'].'/'.$filename,$text);
	return kfm_loadFiles($_SESSION['kfm']['cwd_id']);
}
function kfm_search($keywords){
	global $db;
	$q=$db->prepare('select * from files where name like "%'.addslashes($keywords).'%" order by name');
	$q->execute();
	$files=$q->fetchAll();
	return array('reqdir'=>'','files'=>$files,'uploads_allowed'=>0);
}
{ # export kaejax stuff
	kaejax_export(
		'kfm_changeCaption','kfm_createDirectory','kfm_createEmptyFile','kfm_deleteDirectory',
		'kfm_downloadFileFromUrl','kfm_getFileDetails','kfm_getTextFile','kfm_getThumbnail','kfm_loadDirectories',
		'kfm_loadFiles','kfm_moveFiles','kfm_renameFile','kfm_resizeImage','kfm_rm','kfm_rotateImage',
		'kfm_saveTextFile','kfm_search'
	);
	if(!empty($_POST['kaejax']))kaejax_handle_client_request();
}
?>
<html>
	<head>
		<title>KFM - Kae's File Manager</title>
		<script type="text/javascript" src="lang/<?php
			echo $kfm_language;
		?>.js"></script>
		<script type="text/javascript" src="kfm.js"></script>
		<script type="text/javascript">var starttype="<?php
			echo isset($_GET['Type'])?$_GET['Type']:'';
			?>",fckroot="<?php
			echo $kfm_userfiles;
			?>",fckrootOutput="<?php
			echo $kfm_userfiles_output;
			?>",kfm_log_level=<?php
			echo $kfm_log_level;
			?>;kfm_theme="<?php
			echo $kfm_theme;
			?>";<?php
			echo kaejax_get_javascript();
			?>
		</script>
		<style type="text/css">@import "<?php
		echo 'themes/'.$kfm_theme.'/kfm.css';
		?>";</style>
	</head>
	<body>
		<noscript>KFM relies on JavaScript. Please either turn on JavaScript in your browser, or <a href="http://www.getfirefox.com/">get Firefox</a> if your browser does not support JavaScript.</noscript>
		<script type="text/javascript">setTimeout('kfm()',10);</script>
	</body>
</html>
