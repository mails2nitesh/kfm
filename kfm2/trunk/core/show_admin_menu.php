<?php

// { if no password is set in the config file, then don't allow any access at all
if(KFM_ADMIN_PASSWORD==='')die('<p>Your <b>config.php</b> file has an empty <b>KFM_ADMIN_PASSWORD</b> value.</p><p>Please set a password and reload this page.</p>');
// }

// { if the admin wants to log out, then remove the session variable
if(isset($_REQUEST['logout']) && isset($_SESSION['kfm_is_admin'])){
	unset($_SESSION['kfm_is_admin']);
}
// }

// { if a password was submitted, test it against KFM_ADMIN_PASSWORD
if(isset($_SESSION['kfm_admin_password_field']) && isset($_REQUEST[$_SESSION['kfm_admin_password_field']])){
	if($_REQUEST[$_SESSION['kfm_admin_password_field']]===KFM_ADMIN_PASSWORD){
		unset($_SESSION['kfm_admin_password_field']);
		$_SESSION['kfm_is_admin']=true;
	}
	else echo '<em>Incorrect password entered. Please try again.</em>';
}
// }

// { if the admin is still not logged in, show the login form then exit
if(!isset($_SESSION['kfm_is_admin'])){
	// { generate random login field name (to try slow down automated attacks
	$pass_name=md5(rand());
	$_SESSION['kfm_admin_password_field']=$pass_name;
	// }
	echo '<form action="./" method="post"><p>Please enter the admin password to continue:</p><input type="password" name="'.$pass_name.'" /><input type="submit" value="login" /></form>';
	exit;
}
// }

// { the admin is logged in. show the list of available commands, and load modules if requested
echo '<html><head></head><body>';

// { show list of available modules
echo '<ul style="float:left;">';
echo '<li><a href="./?admin_module=manage_plugins">manage plugins</a></li>';
echo '<li><a href="./?logout=1">log out</a></li>';
echo '</ul>';
// }

echo '<div style="margin-left:15%">';

// { load the module
$module=isset($_REQUEST['admin_module'])?$_REQUEST['admin_module']:'manage_plugins';
// check module name just in case it's compromised...
if(preg_replace('/[a-z_]*/','',$module)!=='')die('<p>No hacking, please.</p>');

if(file_exists(KFM_ROOT.'/core/admin_module_'.$module.'.php'))require KFM_ROOT.'/core/admin_module_'.$module.'.php';
else echo '<b>That module does not exist.</p>';
// }

echo '</div></body></html>';
// }
