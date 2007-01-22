<?php
	$db->query("alter table directories rename to ".$kfm_db_prefix."directories");
	$db->query("alter table files rename to ".$kfm_db_prefix."files");
	$db->query("alter table image_captions rename to ".$kfm_db_prefix."image_captions");
	$db->query("alter table ".$kfm_db_prefix."image_captions rename to ".$kfm_db_prefix."files_images");
	$db->query("alter table parameters rename to ".$kfm_db_prefix."parameters");
	$db->query("alter table tags rename to ".$kfm_db_prefix."tags");
	$db->query("alter table tagged_files rename to ".$kfm_db_prefix."tagged_files");
	$db->query("alter table ".$kfm_db_prefix."files_images add width integer default 0");
	$db->query("alter table ".$kfm_db_prefix."files_images add height integer default 0");
	$db->query("create table ".$kfm_db_prefix."files_images_thumbs(
		id serial,
		image_id integer not null,
		width integer default 0,
		height integer default 0,
		primary key (id),
		foreign key (image_id) references ".$kfm_db_prefix."files_images(id)
	)");
	$db->query("update ".$kfm_db_prefix."parameters set value='0.7.2' where name='version'");
?>
