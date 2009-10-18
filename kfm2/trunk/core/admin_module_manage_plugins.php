<h1>Manage Plugins</h1>
<form action="./?admin_module=manage_plugins" method="post">
	<table>
		<tr><th>Name</th><th>Description</th><th>Version</th><th>Enabled</th></tr>
<?php

	// { save new list of plugins if requested
	if(isset($_REQUEST['a']) && $_REQUEST['a']=='Save'){
		$new_plugins=isset($_REQUEST['enabled_plugins'])?$_REQUEST['enabled_plugins']:array();
		$KFM_PLUGINS['plugins']=array();
		$KFM_PLUGINS['events']=array();
		foreach($new_plugins as $pname=>$var){
			if(file_exists(KFM_ROOT.'/plugins/'.$pname.'/plugin.php')){
				require KFM_ROOT.'/plugins/'.$pname.'/plugin.php';
				$KFM_PLUGINS['plugins'][$pname]=array(
					'name'=>$plugin['name']
				);
			}
		}
		file_put_contents(KFM_USERDIR.'/.files/plugins.json', json_encode($KFM_PLUGINS));
		if(!file_exists(KFM_USERDIR.'/.files/plugins.json')){
			die('Could not create the file "<b>'.KFM_USERDIR.'/.files/plugins.json</b>". Please check the directory "<b>'.KFM_USERDIR.'/.files</b>" to make sure it is writable.');
		}
	}
	// }

	foreach(new DirectoryIterator(KFM_ROOT.'/plugins') as $f){
		if($f->isDot())continue;
		$fname=$f.'';
		if(!file_exists(KFM_ROOT.'/plugins/'.$fname.'/plugin.php'))continue;
		require KFM_ROOT.'/plugins/'.$fname.'/plugin.php';
		echo '<tr><td>'.htmlspecialchars($plugin['name']).'</td>';
		echo '<td>'.htmlspecialchars($plugin['description']).'</td>';
		echo '<td>'.$plugin['version'].'</td>';
		echo '<td><input type="checkbox" name="enabled_plugins['.$fname.']"';
		if(isset($KFM_PLUGINS['plugins'][$fname]))echo ' checked="checked"';
		echo ' /></td></tr>';
	}
?>
		</tr>
	</table>
	<input type="submit" name="a" value="Save" />
</form>
