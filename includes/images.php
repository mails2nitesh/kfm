<?php
function _changeCaption($fid,$newCaption){
	global $kfm_session;
	$cwd_id=$kfm_session->get('cwd_id');
	$im=new Image($fid);
	$im->setCaption($newCaption);
	return kfm_loadFiles($cwd_id);
}
function _getThumbnail($fileid,$width,$height){
	$im=new Image($fileid);
	$im->setThumbnail($width,$height); // Already done in the Image constructor, maybe needed for Thumbnails with different sizes.
	return array($fileid,array('icon'=>$im->thumb_url,'width'=>$im->width,'height'=>$im->height,'caption'=>$im->caption));
}
function _resizeImage($fid,$width,$height){
	global $kfm_session;
	$cwd_id=$kfm_session->get('cwd_id');
	$im=new Image($fid);
	$im->resize($width, $height);
	if($im->hasErrors())return $im->getErrors();
	return kfm_loadFiles($cwd_id);
}
function _rotateImage($fid,$direction){
	$im = new Image($fid);
	$im->rotate($direction);
	if($im->hasErrors())return $im->getErrors();
	return $fid;
}
function _setCaption($fid,$caption){
	
}
?>
