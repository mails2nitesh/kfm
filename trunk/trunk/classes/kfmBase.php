<?php
/**
 * Base kfm class
 */
class kfmBase extends kfmObject{
	var $doctype='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
	var $settings=array();
	var $plugins=array();
	var $themes=array();
	var $user_settings=array();
	var $admin_tabs=array();
	var $associations=array();
	//Settings definition
	var $sdef=array(
		'Structure settings'=>array( 'type'=>'group_header'),
		'kfm_url'=>array('type'=>'text'),
		'file_url'=>array('type'=>'choice_list','options'=>array('File url'=>'url','Secure'=>'secure')),
		'user_root_folder'=>array('type'=>'text'),
		'startup_folder'=>array('type'=>'text'),
		'hidden_panels'=>array('type'=>'select_list','options'=>array('logs','file_details','file_upload','search','directory_properties','widgets')),
		'startup_folder'=>array('type'=>'text', 'properties'=>array('size'=>16)),
		'file_handler'=>array('type'=>'choice_list', 'options'=>array('Return'=>'return','Download'=>'download')),
		'allow_user_file_associations'=>array('type'=>'bool'),
		
		'Display settings'=>array( 'type'=>'group_header'),
		'date_format'=>array( 'type'=>'text', 'properties'=>array('size'=>10,'maxsize'=>25)),
		'time_format'=>array( 'type'=>'text', 'properties'=>array('size'=>10,'maxsize'=>25)),
		'listview'=>array('type'=>'bool'),
		'theme'=>array('type'=>'choice_list','options'=>array()), // will be filled in initialise.php
		'preferred_languages'=>array('type'=>'array'),
	
		'Contextmenu settings'=>array('type'=>'group_header'),
		'subcontext_categories'=>array('type'=>'array'),
		'subcontext_size'=>array('type'=>'integer', 'properties'=>array('size'=>3,'maxsize'=>3)),

		'Directory settings'=>array( 'type'=>'group_header'),
		'root_folder_name'=>array('type'=>'text'),
		'allow_files_in_root'=>array('type'=>'bool'),
		'allow_directory_create'=>array( 'type'=>'bool'),
		'allow_directory_delete'=>array('type'=>'bool'),
		'allow_directory_edit'=>array('type'=>'bool'),
		'allow_directory_move'=>array('type'=>'bool'),
		'folder_drag_action'=>array('type'=>'choice_list', 'options'=>array(
			'always move'=>1,
			'always copy'=>2,
			'choice list'=>3), 'user'=>1
		),
		'default_directories'=>array('type'=>'array', 'properties'=>array('size'=>34)),
		'default_directory_permission'=>array('type'=>'integer', 'properties'=>array('size'=>3,'maxsize'=>3)),
		'banned_folders'=>array('type'=>'array'),
		'allowed_folders'=>array('type'=>'array'),
		
		'File settings'=>array( 'type'=>'group_header'),
		'allow_file_create'=>array('type'=>'bool'),
		'allow_file_delete'=>array('type'=>'bool'),
		'allow_file_edit'=>array('type'=>'bool'),
		'allow_file_move'=>array('type'=>'bool'),
		'show_files_in_groups_of'=>array('type'=>'text','properties'=>array('size'=>3)),
		'files_name_length_displayed'=>array('type'=>'integer'),
		'files_name_length_in_list'=>array( 'type'=>'integer'),
		'banned_extensions'=>array('type'=>'array'),
		'banned_files'=>array('type'=>'array'),
		'allowed_files'=>array('type'=>'array'),
		
		'Image settings'=>array( 'type'=>'group_header'),
		'use_imagemagick'=>array('type'=>'bool'),
		
		'Upload settings'=>array( 'type'=>'group_header'),
		'allow_file_upload'=>array('type'=>'bool'),
		'only_allow_image_upload'=>array('type'=>'bool'),
		//'show_disabled_contextmenu_links'=>array('type'=>'bool'), // Should be depricated
		'use_multiple_file_upload'=>array('type'=>'bool'),
		'default_upload_permission'=>array('type'=>'integer', 'properties'=>array('size'=>3,'maxsize'=>3)),
		'banned_upload_extensions'=>array('type'=>'array'),
		
		'Plugin settings'=>array( 'type'=>'group_header'),
		'disabled_plugins'=>array('type'=>'select_list'),
		'Depricated settings'=>array( 'type'=>'group_header'),
		'return_file_id_to_cms'=>array('type'=>'bool'), // Should be deprecated in favour of plugin
		'allow_multiple_file_returns'=>array('type'=>'bool'), // Should be deprecated in favour of plugin
		'slideshow_delay'=>array('type'=>'integer'),
		'allow_image_manipulation'=>array('type'=>'bool')
	);

	function isUserSetting($name){
		return in_array($name, $this->user_settings);
	}
	function addUserSetting($name){
		if(!$this->isUserSetting($name))$this->user_settings[]=$name;
	}

	/**
	 * This function adds a setting definition. The first parameter is the setting name,
	 * the second the setting information and the third optional one sets the default value.
	 * Look in the documentation for the setting information.
	 */
	function addSdef($name,$def, $value='ste.325#new'){
		$this->sdef[$name]=$def;
		if($value!='ste.325#new')$this->defaultSetting($name,$value);
	}
	function addPlugin($plugin){
		$this->plugins[]=$plugin;
	}

	/**
	 * Function to determine if a plugin is active in KFM
	 * @param $name
	 */
	function isPlugin($name){
		foreach($this->plugins as $p) if($p->name==$name && !$p->disabled)return true;
		return false;
	}

	/**
	 * Function to get a plugin. Returns false if plugin does not exists
	 */
	function getPlugin($name){
		foreach($this->plugins as $p)if($p->name==$name)return $p;
		return false;
	}
	
	/**
	 * setting function, returns a configuration parameter if one config is given, 
	 * sets a config parameter if two parameters are given
	 * @param $name
	 * @param $value optional
	 * 
	 * @return $value
	 */
	function setting($name,$value='novaluegiven'){
		if($value=='novaluegiven'){
			if(!isset($this->settings[$name]))return $this->error('Setting '.$name.' does not exists');
			return $this->settings[$name];
		}
		$this->settings[$name]=$value;
	}

	function defaultSetting($name, $value){
		$this->settings[$name]=$value;
		//if(!isset($this->settings[$name]))$this->settings[$name]=$value;
	}
	
	function addAdminTab($name, $page,$stylesheet=false){
		$this->admin_tabs[]=array('title'=>$name, 'page'=>$page, 'stylesheet'=>$stylesheet);
	}

	/**
	 * returns a parameter, returns the default if not present
	 * @param $parameter
	 * @param $default
	 * @return $value || $default if not present
	 */
	function getParameter($parameter, $default=false){

	}

	/**
	 * sets a parameter
	 * @param $parameter parameter name
	 * @param $value parameter value
	 * @return true on success || false on error
	 */
	function setParameter($parameter, $value){

	}

	function show_login_form($err=''){
		if(file_exists(KFM_BASE_PATH.'login.php'))include(KFM_BASE_PATH.'login.php');
		else include KFM_BASE_PATH.'includes/login.php';
		exit;
	}

	/**
	 * This function returns true if the user is an admin user, false if not
	 */
	function isAdmin(){
		return $this->user_status==1;
	}

	/**
	 * This function should be called in an admin page. If the user is not allowed to view the page, he/she will be shown the login form.
	 */
	function adminPage($level=3){
		$allow=true;
		if(function_exists('kfm_admin_check'))$allow=kfm_admin_check();
		if(!$allow)$this->show_login_form();
		return $allow;
	}

	/**
	 * this function makes sure that the user is the admin user and delivers an error message if not.
	 * if $ajax is true, an ajax error message is returned
	 */
	function requireAdmin($ajax){
		if($this->user_status==1)return true;
		$message="Only the admin user can use this";
		if($ajax)$message='error("'.str_replace('"','\"',$message).'");';
		die($message);
	}

	/* Add an array of associations. This are associations between plugins and extensions. It should be in the form of
	 *	array(
	 *		array( 'plugin' => 'my_image_viewer_plugin', 'extension' => 'jpg, png, gif'),
	 *		array( 'plugin' => 'download', 'extension' => 'pdf' )
	 *	)
	 */
	function addAssociations($associations){
		if(!is_array($associations))return;
		foreach($associations as $association){
			if(strpos($association['extension'],',')!==false){
				$exts=split(',',$association['extension']);
				foreach($exts as $ext) $this->associations[trim($ext)]=trim($association['plugin']);
			}else{
				$this->associations[trim($association['extension'])]=trim($association['plugin']);
			}
		}
	}

	/* Add an association to kfm. This associates a plugin with an extension.
	 * It should be something like:
	 *	array( 'plugin' => 'download', 'extension' => 'pdf' )
	 */
	function addAssociation($plugin, $extensions){
		$this->addAssociations(array('plugin'=>$plugin, 'extension'=>$extensions));
	}
}
