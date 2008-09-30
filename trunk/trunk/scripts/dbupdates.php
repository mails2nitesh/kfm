<?php
if(!isset($kfm_parameters['version_db']))$kfm_parameters['version_db']=0;
$dbv=$kfm_parameters['version_db'];
if($dbv==0){
	$kfmdb->query("insert into ".KFM_DB_PREFIX."parameters (name,value) values ('version_db','1')");
	$dbv=1;
}
if($dbv==1){
	switch($kfm_db_type){
		case 'mysql':{
			$kfmdb->query("CREATE TABLE ".KFM_DB_PREFIX."translations(original TEXT INDEXED,translation TEXT,language VARCHAR(2),calls INT DEFAULT 0,found INT DEFAULT 1)DEFAULT CHARSET=utf8");
			break;
		}
		case 'pgsql':{
			$kfmdb->query("CREATE TABLE ".KFM_DB_PREFIX."translations(original text,translation text,language varchar(2),calls INTEGER DEFAULT 0,found INTEGER DEFAULT 0)");
			break;
		}
		case 'sqlite': case 'sqlitepdo':{
			$kfmdb->query("CREATE TABLE ".KFM_DB_PREFIX."translations(original TEXT,translation TEXT,language VARCHAR(2),calls INTEGER DEFAULT 0,found INTEGER DEFAULT 0)");
		}
	}
	$dbv=2;
}

$kfmdb->query("update ".KFM_DB_PREFIX."parameters set value='$dbv' where name='version_db'");
echo '<p>Database updated. Please reload page.</p>';
exit;
