<?php
/**
 * Combines all plugin javascript for index.php
 * may need some optimalisation
 */
require_once('initialise.php');
header('Content-type: text/javascript');
header('Expires: '.gmdate("D, d M Y H:i:s", time() + 3600*24*365).' GMT');
$js='';
// {{{ backwards compatibility for older plugins, should disappear. New plugins will have a plugin.php file as base.
$h=opendir(KFM_BASE_PATH.'plugins');
while(false!==($file=readdir($h))){
	if(!is_dir(KFM_BASE_PATH.'plugins/'.$file))continue;
	if($file[0]!='.' && substr($file,0,9)!='disabled_'){
		//if(in_array($file, $kfm->setting('disabled_plugins')))continue;
		if(file_exists(KFM_BASE_PATH.'plugins/'.$file.'/plugin.php')) continue; // new style
		else if(file_exists(KFM_BASE_PATH.'plugins/'.$file.'/plugin.js')) $js.=file_get_contents(KFM_BASE_PATH.'plugins/'.$file.'/plugin.js');
	}
}
closedir($h);
// }}}
// {{{ new style
foreach($kfm->plugins as $plugin) $js.=$plugin->getJavascript();
// }}}
echo $js;
