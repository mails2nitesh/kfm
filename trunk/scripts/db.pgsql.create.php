<?php
	$db->query("create table ".$kfm_db_prefix."parameters(name text, value text)");
	$db->query("create table ".$kfm_db_prefix."directories(
		id serial,
		name text,
		physical_address text,
		parent integer not null,
		primary key (id)
	)");
	$db->query("create table ".$kfm_db_prefix."files(
		id serial,
		name text,
		directory integer not null,
		primary key (id),
		foreign key (directory) references ".$kfm_db_prefix."directories(id)
	)");
	$db->query("create table ".$kfm_db_prefix."image_captions(
		id serial,
		caption text,
		file_id integer not null,
		primary key (id),
		foreign key (file_id) references ".$kfm_db_prefix."files(id)
	)");
	$db->query("create table ".$kfm_db_prefix."tags(
		id serial,
		name text,
		primary key (id)
	)");
	$db->query("create table ".$kfm_db_prefix."tagged_files(
		file_id INTEGER,
		tag_id  INTEGER,
		foreign key (file_id) references ".$kfm_db_prefix."files (id),
		foreign key (tag_id) references ".$kfm_db_prefix."tags (id)
	)");

	$db->query("insert into ".$kfm_db_prefix."parameters values('version','".KFM_VERSION."')");
	$res=$db->query("insert into ".$kfm_db_prefix."directories values(1,'','".rtrim(addslashes($rootdir),' /')."',0)");
	if(!PEAR::isError($res))$db_defined=1;
?>
