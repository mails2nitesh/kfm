<?php
	$db->query('create table parameters(name text, value text)');
	$db->query('create table directories(
		id serial,
		name text,
		physical_address text,
		parent integer not null,
		primary key (id)
	)');
	$db->query('create table files(
		id serial,
		name text,
		directory integer not null,
		primary key (id),
		foreign key (directory) references directories(id)
	)');
	$db->query('create table image_captions(
		id serial,
		caption text,
		file_id integer not null,
		primary key (id),
		foreign key (file_id) references files (id)
	)');
	$db->query('create table tags(
		id serial,
		name text
		primary key (id)
	)');
	$db->query('create table tagged_files(
		file_id INTEGER,
		tag_id  INTEGER,
		foreign key (file_id) references files (id),
		foreign key (tag_id) references tags (id)
	)');

	$db->query("insert into parameters values('version','".KFM_VERSION."')");
	$res=$db->query("insert into directories values(1,'','".rtrim(addslashes($rootdir),' /')."',0)");
	if(!PEAR::isError($res))$db_defined=1;
?>
