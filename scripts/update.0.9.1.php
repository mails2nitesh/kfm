<?php
if($_SESSION['kfm_parameters']['version']==''||$_SESSION['kfm_parameters']['version']=='7.0'||$_SESSION['kfm_parameters']['version']<'0.9.1')require 'scripts/update.0.8.php';
switch($kfm_db_type){
	case 'mysql':{
		require 'scripts/db.mysql.update.0.9.1.php';
		break;
	}
	case 'pgsql':{
		require 'scripts/db.pgsql.update.0.9.1.php';
		break;
	}
	case 'sqlite':{
		require 'scripts/db.sqlite.update.0.9.1.php';
		break;
	}
	default:{
		echo 'error: unknown database specified in scripts/update.0.9.1.php'; # TODO: new string
		exit;
	}
}
$kfmdb->query("DELETE FROM ".$kfm_db_prefix."parameters WHERE name='version'");
$kfmdb->query("INSERT INTO ".$kfm_db_prefix."parameters SET value='0.9.1',name='version'");
?>
