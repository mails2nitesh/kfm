<?php
# see license.txt for licensing
function kfm_functions_image_setCaption($filename,$newCaption){
	if(!kfm_checkAddr($filename))return;
	$captionfile=$_SESSION['kfm']['currentdir'].'/.captions/'.$filename;
	$file=fopen($captionfile,'w');
	fwrite($file,$newCaption);
	fclose($file);
}
?>
