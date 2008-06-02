<?php
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
	extension varchar(16),
	plugin varchar(256),
	user_id INTEGER(8)
)");

$kfmdb->query('INSERT INTO '.KFM_DB_PREFIX.'users (id, username, password, status) VALUES (1,"admin", "'.sha1('admin').'",1)');
