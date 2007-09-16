<?php
	$kfmdb->query("CREATE TABLE ".$kfm_db_prefix."session (
		`id` int(11) NOT NULL auto_increment,
		`cookie` varchar(32) default NULL,
		`last_accessed` datetime default NULL,
		PRIMARY KEY  (`id`)
	) DEFAULT CHARSET=utf8");
	$kfmdb->query("CREATE TABLE ".$kfm_db_prefix."session_vars (
		`session_id` int(11) default NULL,
		`varname` text,
		`varvalue` text,
		KEY `session_id` (`session_id`),
		CONSTRAINT `".$kfm_db_prefix."session_vars_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `".$kfm_db_prefix."session` (`id`)
	)");
?>
