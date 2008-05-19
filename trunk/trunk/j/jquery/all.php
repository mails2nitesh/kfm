<?php
require '../../initialise.php';

header('Content-type: text/javascript');
header('Expires: '.gmdate("D, d M Y H:i:s", time() + 3600*24*365).' GMT');

$name=md5_of_dir(KFM_BASE_PATH.'j/jquery/');
if(file_exists(WORKPATH.$name))readfile(WORKPATH.$name);
else{
	$js=file_get_contents('jquery-1.2.3.min.js');
	$js.=file_get_contents('jquery.dimensions.pack.js');
	$js.=file_get_contents('jquery.impromptu.js');
	$js.=file_get_contents('jquery.iutil.pack.js');
	$js.=file_get_contents('jquery.idrag.js');
	$js.=file_get_contents('jquery.grid.columnSizing.js');
	$js.=file_get_contents('jquery.tablesorter.js');
	require '../../includes/jsmin-1.1.1.php';
	$js=JSMin::minify($js);
	file_put_contents(WORKPATH.$name,$js);
	echo $js;
}
