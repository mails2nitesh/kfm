<?php
	$kfmdb->query("create table ".KFM_DB_PREFIX."directories(
		id INTEGER PRIMARY KEY,
		name text,
		parent integer not null
	)");
	$kfmdb->query("create table ".KFM_DB_PREFIX."files(
		id INTEGER PRIMARY KEY,
		name text,
		directory integer not null,
		foreign key (directory) references ".KFM_DB_PREFIX."directories(id)
	)");
	$kfmdb->query("create table ".KFM_DB_PREFIX."files_images(
		id INTEGER PRIMARY KEY,
		caption text,
		file_id integer not null,
		width integer default 0,
		height integer default 0,
		foreign key (file_id) references ".KFM_DB_PREFIX."files(id)
	)");
	$kfmdb->query("create table ".KFM_DB_PREFIX."files_images_thumbs(
		id INTEGER PRIMARY KEY,
		image_id integer not null,
		width integer default 0,
		height integer default 0,
		foreign key (image_id) references ".KFM_DB_PREFIX."files_images(id)
	)");
	$kfmdb->query("create table ".KFM_DB_PREFIX."parameters(name text, value text)");
	$kfmdb->query("CREATE TABLE ".KFM_DB_PREFIX."session (
		id INTEGER PRIMARY KEY,
		cookie varchar(32) default NULL,
		last_accessed datetime default NULL
	)");
	$kfmdb->query("CREATE TABLE ".KFM_DB_PREFIX."session_vars (
		session_id INTEGER,
		varname text,
		varvalue text,
		FOREIGN KEY (session_id) REFERENCES ".KFM_DB_PREFIX."session (id)
	)");
	$kfmdb->query("create table ".KFM_DB_PREFIX."tags(
		id INTEGER PRIMARY KEY,
		name text
	)");
	$kfmdb->query("create table ".KFM_DB_PREFIX."tagged_files(
		file_id INTEGER,
		tag_id  INTEGER,
		foreign key(file_id) references ".KFM_DB_PREFIX."files(id),
		foreign key(tag_id) references ".KFM_DB_PREFIX."tags(id)
	)");
$kfmdb->query("CREATE TABLE ".KFM_DB_PREFIX."users(
	`id` int(11) NOT NULL auto_increment,
	`username` varchar(16),
	password varchar(40),
	status INTEGER(1) default 2
)");
 
$kfmdb->query("CREATE TABLE ".KFM_DB_PREFIX."settings(
	id int(11) NOT NULL auto_increment,
	name varchar(128),
	value varchar(256),
	user_id INTEGER(8),
	usersetting INTEGER(1) default 0
)");

$kfmdb->query("CREATE TABLE ".KFM_DB_PREFIX."plugin_extensions(
	id int(11) NOT NULL auto_increment,
	extension varchar(64),
	plugin varchar(64),
	user_id INTEGER(8)
)");

$kfmdb->query('INSERT INTO '.KFM_DB_PREFIX.'users (id, username, password, status) VALUES (1,"admin", "'.sha1('admin').'",1)');

	$kfmdb->query("insert into ".KFM_DB_PREFIX."parameters values('version','1.3')");
	$kfmdb->query("insert into ".KFM_DB_PREFIX."directories values(1,'root',0)");
	$db_defined=1;
?>
