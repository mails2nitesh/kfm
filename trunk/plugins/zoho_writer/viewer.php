<?php
require_once('../../initialise.php');
if(!isset($_GET['id'])) die ('no id specified');
$f=kfmFile::getInstance($_GET['id']);
if(!$f)die ('file can not be initialized');
?>
<html>
<head>
<title>Zoho viewer</title>
<script type="text/javascript" src="../../j/jquery/all.php"></script>
<script type="text/javascript">
var $j = jQuery.noConflict();
$j(document).ready(function(){
	$j('#zoho_writer_form').get(0).submit();
});
</script>
<style type="text/css">
body{
	background-color:#eee;
}
.jqifade{
	position: absolute;
	background-color: #333333;
}
div.jqi{
	position: absolute;
	background-color: #888;
	padding: 10px; 
	width: 300px;
	text-align: left;
}
div.jqi .jqicontainer{
	background-color: #bbb;
	padding: 5px; 
	color: #ddd;
	font-weight: bold;
}
div.jqi .jqimessage{
	background-color: #555;
	padding: 10px;
}
div.jqi .jqibuttons{
	text-align: center;
	padding: 5px 0 0 0;
}
div.jqi button{
	padding: 3px 10px 3px 10px;
	margin: 0 10px;
}
</style>
</head>
<body>
<?php
require 'configuration.php';
if(!isset($zoho_apikey)){
	print 'You have not defined your Zoho apikey. <br/>
	You can aquire one at:<a href="http://writer.zoho.com/apikey.htm">http://writer.zoho.com/apikey.htm</a><br/>
	set your apikey in the file plugins/zoho_writer/configuration.php as:<br/>
	$zoho_apikey="[apikey]";<br/>
	';
	exit;
}
?>
<form method="POST" action="http://export.writer.zoho.com/remotedoc.im?apikey=<?php echo $zoho_apikey;?>&output=editor" target="_self" id="zoho_writer_form">
<input type="hidden" name="url" value="<?php echo $f->getUrl();?>">
<input type="hidden" name="filename" value="<?php echo $f->name;?>">
<input type="hidden" name="saveurl" value="<?php echo $kfm_session->get('kfm_url').'plugins/zoho_writer/save_file.php';?>">
<input type="hidden" name="id" value="<?php echo $f->id.'_'.$kfm_session->key;?>">
<input type="hidden" name="format" value="<?php echo $f->getExtension();?>">
<input type="hidden" name="persistence" value="false">
<input type="submit" value="Edit" class="divbutton" name="submit2">
</form>
</body>
</html>
