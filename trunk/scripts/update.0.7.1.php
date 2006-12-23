<?php
echo 'test';
switch($kfm_db_type){
	case 'mysql':{
		require 'scripts/db.mysql.update.0.7.1.php';
		break;
	}
	case 'pgsql':{
		require 'scripts/db.pgsql.update.0.7.1.php';
		break;
	}
	case 'sqlite':{
		require 'scripts/db.sqlite.update.0.7.1.php';
		break;
	}
	default:{
		echo 'error: unknown database specified in scripts/update.0.7.1.php'; # TODO: new string
		exit;
	}
}
echo '<em>Your database has been updated. Please reload this window.</em>'; # TODO: new string
exit;
?>
