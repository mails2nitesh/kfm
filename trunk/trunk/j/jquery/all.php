<?php
require '../../initialise.php';
require '../libs.php';

header('Content-type: text/javascript');
header('Expires: '.gmdate("D, d M Y H:i:s", time() + 3600*24*365).' GMT');

$md5path=WORKPATH.md5_of_dir(KFM_BASE_PATH.'j/jquery/');
if(file_exists($md5path))readfile($md5path);
else{
	$js=file_get_contents('jquery.dimensions.pack.js');
	$js.=file_get_contents('jquery.impromptu.js');
	$js.=file_get_contents('jquery.iutil.pack.js');
	$js.=file_get_contents('jquery.idrag.js');
	$js.=file_get_contents('jquery.grid.columnSizing.js');
	$js.=file_get_contents('jquery.tablesorter.js');
	if(isset($_REQUEST['minify'])){
		require '../../includes/jsmin-1.1.1.php';
		$js=JSMin::minify($js);
		file_put_contents($md5path,$js);
		if(!file_exists($md5path))echo 'failed to write to '.$md5path;
		delete_old_md5s(WORKPATH);
		exit;
	}
	else{
		$js.="setTimeout(function(){var a=document.createElement('img');a.src='j/jquery/all.php?minify=1';a.style.display='none';document.body.appendChild(a);},10000);";
	}
	echo $js;
}
