<?php
	$kfmdb->query("ALTER TABLE ".$kfm_db_prefix."directories         DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci");
	$kfmdb->query("ALTER TABLE ".$kfm_db_prefix."directories         DROP physical_address");
	$kfmdb->query("ALTER TABLE ".$kfm_db_prefix."directories         CHANGE name name text");
	$kfmdb->query("ALTER TABLE ".$kfm_db_prefix."files               DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci");
	$kfmdb->query("ALTER TABLE ".$kfm_db_prefix."files               CHANGE name name text");
	$kfmdb->query("ALTER TABLE ".$kfm_db_prefix."files_images        DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci");
	$kfmdb->query("ALTER TABLE ".$kfm_db_prefix."files_images        CHANGE caption caption text");
	$kfmdb->query("ALTER TABLE ".$kfm_db_prefix."files_images_thumbs DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci");
	$kfmdb->query("ALTER TABLE ".$kfm_db_prefix."parameters          DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci");
	$kfmdb->query("ALTER TABLE ".$kfm_db_prefix."parameters          CHANGE name name text");
	$kfmdb->query("ALTER TABLE ".$kfm_db_prefix."parameters          CHANGE value value text");
	$kfmdb->query("ALTER TABLE ".$kfm_db_prefix."tagged_files        DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci");
	$kfmdb->query("ALTER TABLE ".$kfm_db_prefix."tags                DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci");
	$kfmdb->query("ALTER TABLE ".$kfm_db_prefix."tags                CHANGE name name text");
?>
