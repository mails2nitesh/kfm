<?php
$version=$kfm_parameters['version'];
if($version==''||$version=='7.0'||$version<'0.9.2')require 'scripts/update.0.9.2.php';
$kfm_parameters['version']='1.0';
$kfmdb->query("delete from ".$kfm_db_prefix."parameters where name='version'");
$kfmdb->query("insert into ".$kfm_db_prefix."parameters (name,value) values ('version','1.0')");
?>
