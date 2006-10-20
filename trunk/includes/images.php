<?php
function _changeCaption($fid,$newCaption){
	include_once('functions.image.php');
	kfm_functions_image_setCaption($fid,$newCaption);
	return kfm_loadFiles($_SESSION['kfm']['cwd_id']);
}
function _getCaption($dirname,$filename){
	// new parameter $fileid benjamin
	// until then.....
	return 'caption currently unavailable';
	global $db;
	$q=$db->prepare("SELECT caption FROM files WHERE id='$fileid'");
	$q->execute;
	$filedata = $q->fetch();
	if(count($filedata)){
		return $filedata['caption'];
	}else{
		return 'error retrieving caption';
	}	
}
function _getThumbnail($fileid,$width,$height){
	$file = new File($fileid);
	$reqdir = $file->directory;
	$dirname=str_replace($GLOBALS['rootdir'],'',$reqdir);
	$filename=$file->name;
	$caption=kfm_getCaption($dirname,$filename);
	$thumbnail=$file->id.' '.$width.'x'.$height.' '.$filename;
	if(!kfm_checkAddr($thumbnail))return 'error: illegal filename "'.$thumbnail.'"';
	$originalfile=$file->path;
	if(!file_exists($originalfile))return 'error: missing file "'.$filename.'"';
	$thumbnailurl=WORKURL.$thumbnail;
	$thumbnailfile=WORKPATH.$thumbnail;
	$info=getimagesize($originalfile);
	if(file_exists($thumbnailfile))return array($fileid,array('icon'=>$thumbnailurl,'width'=>$info[0],'height'=>$info[1],'caption'=>$caption));
	if(!$info)return 'error: "'.$filename.'" is not an image';
	$type=0;
	switch($info[2]){
		case 1:$type='gif';break;
		case 2:$type='jpeg';break;
		case 3:$type='png';break;
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
	$save($im,$thumbnailfile,($type=='jpeg'?100:9));
	$im=null;
	return array($fileid,array('icon'=>$thumbnailurl,'width'=>$info[0],'height'=>$info[1],'caption'=>$caption));
}
function _resizeImage($fid,$width,$height){
	$file = new File($fid);
	$filename=$file->name;
	if(!kfm_checkAddr($filename))return;
	$icons=glob(WORKPATH.$fid.' [0-9]*x[0-9]* '.$filename);
	foreach($icons as $f)unlink($f);
	$originalfile=$file->path;
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
	$save($im,$originalfile,($type=='jpeg'?100:9));
	$im=null;
	return kfm_loadFiles($_SESSION['kfm']['cwd_id']);
}
function _rotateImage($fid,$direction){
	//global $db;
	//$qf=$db->query("SELECT files.name AS name, directories.physical_address AS physical_address FROM files, directories WHERE files.id='$fid' AND directories.id = files.directory");
	$file = new File($fid);
	$filename=$file->name;
	if(!is_writable($file->path)) return "error: no permission to alter file";
	if(!kfm_checkAddr($filename))return;
	$icons=glob(WORKPATH.$fid.' [0-9]*x[0-9]* '.$filename);
	foreach($icons as $f)unlink($f);
	$info=getimagesize($file->path);
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
			$imfile=$load($file->path);
			$im=imagecreatetruecolor($info[0],$info[1]);
			imagecopyresized($im,$imfile,0,0,0,0,$info[0],$info[1],$info[0],$info[1]);
			$im=imagerotate($im,$direction,0);
			$save($im,$file->path,($type=='jpeg'?100:9));
		}
		return kfm_loadFiles($_SESSION['kfm']['cwd_id']);
	}
}
?>
