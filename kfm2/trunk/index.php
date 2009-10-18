<?php

define('KFM_ROOT',dirname(__FILE__));
session_start();

// { load config file, and give an error if it's not found
if(!include 'config.php'){
	die('Please copy the provided config.dist.php to config.php');
}
// }

// { load plugins
$KFM_PLUGINS=file_get_contents(KFM_USERDIR.'/.files/plugins.json', true);
if($KFM_PLUGINS!==false)$KFM_PLUGINS=json_decode($KFM_PLUGINS,true);
if($KFM_PLUGINS===false || $KFM_PLUGINS===null){ // error parsing plugins file
	require 'core/handle_failed_plugins_json_load.php';
}
// }

// { handle requested command
$req_plugin=isset($_REQUEST['p'])?$_REQUEST['p']:'';
if(isset($KFM_PLUGINS['plugins'][$req_plugin])){
	require_once 'plugins/'.$req_plugin.'/'.$req_plugin.'.php';
	$req_plugin();
}
else{
	require 'core/show_admin_menu.php';
}
// }
