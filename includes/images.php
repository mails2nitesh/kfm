<?php
function _changeCaption($fid,$newCaption){
	include_once('functions.image.php');
	_setCaption($fid,$newCaption);
	return kfm_loadFiles($_SESSION['kfm']['cwd_id']);
}
function _createImageResource($file,$info){
	$im=imagecreatetruecolor($info[0],$info[1]);
	imagecopyresized($im,$file,0,0,0,0,$info[0],$info[1],$info[0],$info[1]);
	return $im;
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
function _getImageType($inf){
	switch($inf[2]){
		case 1: return 'gif';
		case 2: return 'jpeg';
		case 3: return 'png';
	}
	return 0;
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
	$type=_getImageType($info);
	if(!$type)return 'error: unknown image type for "'.$filename.'"'; # TODO: new string
	$load='imagecreatefrom'.$type;
	$save='image'.$type;
	if(!function_exists($load)||!function_exists($save))return 'server cannot handle image of type "'.$type.'"';
	$im=_createImageResource($load($originalfile),$info);
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
	_removeIcons($fid);
	$originalfile=$file->path;
	if(!file_exists($originalfile))return;
	$info=getimagesize($originalfile);
	if(!$info)return;
	$type=_getImageType($info);
	if(!$type)return;
	$load='imagecreatefrom'.$type;
	$save='image'.$type;
	if(!function_exists($load)||!function_exists($save))return;
	$im=_createImageResource($load($originalfile),$info);
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
	$file = new File($fid);
	$filename=$file->name;
	if(!$file->isWritable()) return "error: no permission to alter file";
	if(!kfm_checkAddr($filename))return;
	_removeIcons($fid);
	$info=getimagesize($file->path);
	if($info){
		$type=_getImageType($info);
		if($type){
			$load='imagecreatefrom'.$type;
			$save='image'.$type;
			if(!function_exists($load)&&!function_exists($save))return;
			$im=_createImageResource($load($file->path),$info);
			$im=imagerotate($im,$direction,0);
			$save($im,$file->path,($type=='jpeg'?100:9));
		}
		return kfm_loadFiles($_SESSION['kfm']['cwd_id']);
	}
}
function _removeIcons($fid){
	$icons=glob(WORKPATH.$fid.' [0-9]*x[0-9]*.*');
	foreach($icons as $f)unlink($f);
}
function _setCaption($fid,$newCaption){
	// parameters: $fileid, $newCaption
	// until then....
	return 'error: caption cannot be set';
	global $db;
	$q = $db->prepare("UPDATE files SET caption = '$newCaption' WHERE id='$fileid'");
	$q->execute();
	// checks for succes in the future
	// until then.... assume success
	return true;
}
?>
