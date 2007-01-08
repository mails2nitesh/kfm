<?php
	$db->query("create table ".$kfm_db_prefix."parameters(name text, value text)");
	$db->query("create table ".$kfm_db_prefix."directories(
		id INTEGER PRIMARY KEY auto_increment,
		name text,
		physical_address text,
		parent integer not null
	)");
	$db->query("create table ".$kfm_db_prefix."files(
		id INTEGER PRIMARY KEY auto_increment,
		name text,
		directory integer not null,
		foreign key (directory) references directories(id)
	)");
	$db->query("create table ".$kfm_db_prefix."image_captions(
		id INTEGER PRIMARY KEY auto_increment,
		caption text,
		file_id integer not null,
		foreign key (file_id) references files (id)
	)");
	$db->query("create table ".$kfm_db_prefix."tags(
		id INTEGER PRIMARY KEY auto_increment,
		name text
	)");
	$db->query("create table ".$kfm_db_prefix."tagged_files(
		file_id	INTEGER,
		tag_id	INTEGER,
		foreign key (file_id) references files (id),
		foreign key (tag_id) references tags (id)
	)");

	$db->query("insert into ".$kfm_db_prefix."parameters values('version','".KFM_VERSION."')");
	$res=$db->query("insert into ".$kfm_db_prefix."directories values(1,'','".rtrim(addslashes($rootdir),' /')."',0)");
	if(!PEAR::isError($res))$db_defined=1;
?>
