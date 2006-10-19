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
	global $db;
	$qf=$db->prepare("SELECT * FROM files WHERE id='$fileid'");
	$qf->execute();
	$filedata = $qf->fetch();
	$qd=$db->prepare("SELECT * FROM directories WHERE id='$filedata[directory]'");
	$qd->execute();
	$dirdata=$qd->fetch();
	$reqdir=count($dirdata)?$dirdata['physical_address'].'/':$GLOBALS['rootdir'];
	$dirname=str_replace($GLOBALS['rootdir'],'',$reqdir);
	$filename=$filedata['name'];
	$caption=kfm_getCaption($dirname,$filename);
	$thumbnail=$filedata['id'].' '.$width.'x'.$height.' '.$filename;
	if(!kfm_checkAddr($thumbnail))return 'error: illegal filename "'.$thumbnail.'"';
	$originalfile=$GLOBALS['rootdir'].$dirname.$filename;
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
	global $db;
	$qf=$db->query("select * from files where id='$fid'");
	$filedata = $qf->fetch();
	$filename=$filedata['name'];
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
	$save($im,$originalfile,($type=='jpeg'?100:9));
	$im=null;
	return kfm_loadFiles($_SESSION['kfm']['cwd_id']);
}
function _rotateImage($fid,$direction){
	global $db;
	$qf=$db->query("select * from files where id='$fid'");
	$filedata = $qf->fetch();
	$filename=$filedata['name'];
	if(!kfm_checkAddr($filename))return;
	$icons=glob($_SESSION['kfm']['currentdir'].'/.files/'.$fid.' [0-9]*x[0-9]* '.$filename);
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
			$save($im,$_SESSION['kfm']['currentdir'].'/'.$filename,($type=='jpeg'?100:9));
		}
		return kfm_loadFiles($_SESSION['kfm']['cwd_id']);
	}
}
?>
