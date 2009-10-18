<?php
defined('KFM_USERDIR') or die('This file should not be loaded directly.');

// { if the plugins.json file already exists, then this problem needs to be solved manually.
if(file_exists(KFM_USERDIR.'/.files/plugins.json')){
	echo 'Failed to load the file "<b>'.KFM_USERDIR.'/.files/plugins.json</b>". Please check it and either correct the errors in it, or back it up and delete it so a fresh one can be created.';
}
// }
// { check for the directory's existence. create it if necessary.
if(!is_dir(KFM_USERDIR.'/.files')){
	// create the directory.
	mkdir(KFM_USERDIR.'/.files', 0700);
	if(!is_dir(KFM_USERDIR.'/.files')){
		die('Failed to create the directory "<b>'.KFM_USERDIR.'/.files</b>". Please make sure that the directory "<b>'.KFM_USERDIR.'</b>" exists and is writable by the server.');
	}

}
// }
// { create the plugins.json file
$KFM_PLUGINS=array(
	'plugins'=>array(),
	'events'=>array()
);
file_put_contents(KFM_USERDIR.'/.files/plugins.json', json_encode($KFM_PLUGINS));
if(!file_exists(KFM_USERDIR.'/.files/plugins.json')){
	die('Could not create the file "<b>'.KFM_USERDIR.'/.files/plugins.json</b>". Please check the directory "<b>'.KFM_USERDIR.'/.files</b>" to make sure it is writable.');
}
// }
