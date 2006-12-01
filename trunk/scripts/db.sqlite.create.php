<?php
	$db->query('create table parameters(name text, value text)');
	$db->query('create table directories(
		id INTEGER PRIMARY KEY,
		name text,
		physical_address text,
		parent integer not null
	)');
	$db->query('create table files(
		id INTEGER PRIMARY KEY,
		name text,
		directory integer not null,
		foreign key (directory) references directories(id)
	)');
	$db->query('create table image_captions(
		id INTEGER PRIMARY KEY,
		caption text,
		file_id integer not null,
		foreign key (file_id) references files (id)
	)');

	$db->query('insert into parameters values("version","'.KFM_VERSION.'")');
	$db->query('insert into directories values(1,"","'.rtrim(addslashes($rootdir), ' /').'",0)');
?>
