<?php
	$db->query('create table parameters(name text, value text)');
	$db->query('create table directories(
		id INTEGER PRIMARY KEY auto_increment,
		name text,
		physical_address text,
		parent integer not null
	)');
	$db->query('create table files(
		id INTEGER PRIMARY KEY auto_increment,
		name text,
		directory integer not null,
		foreign key (directory) references directories(id)
	)');
	$db->query('create table image_captions(
		id INTEGER PRIMARY KEY auto_increment,
		caption text,
		file_id integer not null,
		foreign key (file_id) references files (id)
	)');

	$db->query('insert into parameters values("version","'.KFM_VERSION.'")');
	$res=$db->query('insert into directories values(1,"","'.rtrim(addslashes($rootdir)).'",0)');
	if(!PEAR::isError($res))$db_defined=1;
?>
