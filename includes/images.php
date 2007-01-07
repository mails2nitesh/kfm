<?php
function _changeCaption($fid,$newCaption){
	$im = new Image($fid);
	$im->setCaption($newCaption);
	return kfm_loadFiles($_SESSION['kfm']['cwd_id']);
}
function _getCaption($dirname,$filename){
	// new parameter $fileid benjamin
	// until then.....
	return 'caption currently unavailable';
	// I don't know when it should be used, but is, it should look like:
	$im = new Image($fid);
	return $im->caption;
}
function _getThumbnail($fileid,$width,$height){
	$im=new Image($fileid);
	$im->setThumbnail($width,$height);
	return array($fileid,array('icon'=>$im->thumb_url,'width'=>$im->width,'height'=>$im->height,'caption'=>$im->caption));
}
function _resizeImage($fid,$width,$height){
	$im = new Image($fid);
	$im->resize($width, $height);
	return kfm_loadFiles($_SESSION['kfm']['cwd_id']);
}
function _rotateImage($fid,$direction){
	$im = new Image($fid);
	$im->rotate($direction);
	return kfm_loadFiles($_SESSION['kfm']['cwd_id']);
}
function _setCaption($fid,$caption){
	
}
?>
