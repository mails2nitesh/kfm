<?php
$version=$kfm_parameters['version'];
if($version==''||$version=='7.0'||$version<'1.1.1')require 'scripts/update.1.1.php';
$kfm_parameters['version']='1.1.1';
$kfmdb->query("delete from ".$kfm_db_prefix."parameters where name='version'");
$kfmdb->query("insert into ".$kfm_db_prefix."parameters (name,value) values ('version','".$kfm_parameters['version']."')");
?>
