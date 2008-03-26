<?php
if(!isset($_REQUEST['id']))die('error: id is not set');
$a=split('_',$_REQUEST['id']);
if(count($a)!=2)die ('error in return id');
$_GET['kfm_session']=$a[1];
require_once('../../initialise.php');
$f=kfmFile::getInstance($a[0]);
if(!$f)die ('error: file can not be initialized');

$content=file_get_contents($_FILES['content']['tmp_name']);
$f->setContent($content);
?>
