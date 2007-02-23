<?php
# see license.txt for licensing
error_reporting(E_USER_ERROR | E_USER_WARNING | E_USER_NOTICE);
session_start();
set_include_path(get_include_path().PATH_SEPARATOR .'pear');
if(!file_exists('configuration.php')){
	echo '<em>Missing <code>configuration.php</code>!</em><p>If this is a fresh installation of KFM, then please rename <code>configuration.php.dist</code> to <code>configuration.php</code>, and edit it according to your project\'s needs.</p><p>If this is an upgraded version of KFM, please remove the parts of your old <code>config.php</code> which do not exist in <code>configuration.php.dist</code>, then rename it to <code>configuration.php</code>.</p>';
	exit;
}
require('configuration.php');


{ # API - for programmers only
	if(file_exists('api/config.php'))include('api/config.php');
}
function kfm_error_log($errno,$errstr,$errfile,$errline){
	if(!ERROR_LOG_LEVEL)return;
	$msg = false;
	switch ($errno) {
		case E_USER_ERROR:{
			if(ERROR_LOG_LEVEL>2)$msg='error|'.$errno.'|'.$errfile.'|'.$errline.'|'.$errstr."\n";
			break;
		}
		case E_USER_WARNING:{
			if(ERROR_LOG_LEVEL>1)$msg='warning|'.$errno.'|'.$errfile.'|'.$errline.'|'.$errstr."\n";
			break;
		}
		case E_USER_NOTICE:{
			if(ERROR_LOG_LEVEL)$msg='notice|'.$errno.'|'.$errfile.'|'.$errline.'|'.$errstr."\n";
			break;
		}
		default:{
			if(ERROR_LOG_LEVEL>3)$msg='unknown|'.$errno.'|'.$errfile.'|'.$errline.'|'.$errstr."\n";
			break;
		}
	}
	if($msg&&$handle=fopen(WORKPATH.'errors.log', 'a')){
		@fwrite($handle, date('Y-m-d H:i:s').' '.$msg."\n" );
		@fclose($handle);
	}
}
set_error_handler('kfm_error_log');
{ # variables
	define('KFM_VERSION',rtrim(file_get_contents('version.txt')));
	$rootdir=str_replace('//','/',$_SERVER['DOCUMENT_ROOT'].$kfm_userfiles.'/');
	if(!is_dir($rootdir))mkdir($rootdir,0755);
	if(!isset($_SESSION['kfm']))$_SESSION['kfm']=array(
		'currentdir'=>rtrim($rootdir,' /'),
		'cwd_id'=>1,
		'language'=>''
	);
	define('LSQUIGG','{');
	define('RSQUIGG','}');
	define('KFM_DIR', dirname(__FILE__));
	$kfm_highlight_extensions=array('php'=>'PHP', 'html'=>'HTML', 'xhtml'=>'HTML',
				 'sql'=>'MYSQL', 'js'=>'JAVASCRIPT', 'css'=>'CSS', 'xml'=>'XML');
	if(!isset($kfm_banned_files)||!is_array($kfm_banned_files))$kfm_banned_files = array();
	array_push($kfm_banned_files, 'thumbs.db', '.ds_store'); # lowercase array
	if(!isset($kfm_banned_folders)||!is_array($kfm_banned_folders)) $kfm_banned_folders = array();
	define('IMAGEMAGICK_PATH',isset($kfm_imagemagick_path)?$kfm_imagemagick_path:'/usr/bin/convert');
	$cache_directories=array();
}
{ # work directory
	$workpath = $rootdir.$kfm_workdirectory; // should be more at the top of this document
	$workurl = $kfm_userfiles_output.$kfm_workdirectory;
	$workdir = true;
	if(substr($workpath,-1)!='/') $workpath.='/';
	if(substr($workurl,-1)!='/') $workurl.='/';
	define('WORKPATH', $workpath);
	define('WORKURL', $workurl);
	if(is_dir($workpath)){
		if(!is_writable($workpath)) $workdir = false;
	}else{
		# Support for creating the directory
		$workpath_tmp = substr($workpath,0,-1);
		if(is_writable(dirname($workpath_tmp))){
			mkdir($workpath_tmp, 0755);
		}else{
			$workdir = false;
		}
	}
	if(!$workdir){
		# in the future kfm should be able to work without a working directory. Then less functions will be available
		# If that is the case, an error will be generated that there is limited functionality because there is no proper workdirectory
		# but that is for the future, now kfm will not run
		echo 'error: no writable workpath is specified'; # TODO: new string
		exit;
	}
}
{ # database
	if(!isset($_SESSION['db_defined']))$_SESSION['db_defined']=0;
	$kfm_db_prefix_escaped=str_replace('_','\\\\_',$kfm_db_prefix);
	switch($kfm_db_type){
		case 'mysql': {
			require_once('MDB2.php');
			$dsn='mysql://'.$kfm_db_username.':'.$kfm_db_password.'@'.$kfm_db_host.'/'.$kfm_db_name;
			$db=&MDB2::factory($dsn);
			if(PEAR::isError($db))die($db->getMessage());
			$db->setFetchMode(MDB2_FETCHMODE_ASSOC);
			if(!$_SESSION['db_defined']){
				$res=&$db->query("show tables like '".$kfm_db_prefix_escaped."%'");
				if(!$res->numRows())include('scripts/db.mysql.create.php');
				else $_SESSION['db_defined']=1;
			}
			break;
		}
		case 'pgsql': {
			require_once('MDB2.php');
			$dsn='pgsql://'.$kfm_db_username.':'.$kfm_db_password.'@'.$kfm_db_host.'/'.$kfm_db_name;
			$db=&MDB2::factory($dsn);
			if(PEAR::isError($db))die($db->getMessage());
			$db->setFetchMode(MDB2_FETCHMODE_ASSOC);
			if(!$_SESSION['db_defined']){
				$res=&$db->query("SELECT tablename from pg_tables where tableowner=current_user AND tablename NOT LIKE E'pg\\\\_%' AND tablename NOT LIKE E'sql\\\\_%' AND tablename LIKE E'".$kfm_db_prefix_escaped."%'");
				if($res->numRows()<1)include('scripts/db.pgsql.create.php');
				else $_SESSION['db_defined']=1;
			}
			break;
		}
		case 'sqlite': {
			require_once('MDB2.php');
			$db_create = false;
			define('DBNAME',$kfm_db_name);
			if(!file_exists(WORKPATH.DBNAME))$db_create=true;
			$dsn=array('phptype'=>'sqlite','database'=>WORKPATH.DBNAME,'mode'=>'0644');
			$db=&MDB2::factory($dsn);
			if(PEAR::isError($db))die($db->getMessage());
			$db->setFetchMode(MDB2_FETCHMODE_ASSOC);
			if($db_create)include('scripts/db.sqlite.create.php');
			$_SESSION['db_defined']=1;
			break;
		}
		default: {
			echo "unknown database type specified ($kfm_db_type)"; # TODO: new string
			exit;
		}
	}
	if(!$_SESSION['db_defined']){
		echo 'failed to connect to database'; # TODO: new string
		exit;
	}
}
{ # get kfm parameters and check for updates
	if(!isset($_SESSION['kfm_parameters'])){
		$_SESSION['kfm_parameters']=array();
		$q=$db->query("select * from ".$kfm_db_prefix."parameters");
		$rs=$q->fetchAll();
		foreach($rs as $r)$_SESSION['kfm_parameters'][$r['name']]=$r['value'];
		if($_SESSION['kfm_parameters']['version']!=KFM_VERSION)require 'scripts/update.0.8.php';
	}
}
{ # languages
	$kfm_language='';
	{ # find available languages
		if($handle=opendir('lang')){
			$files=array();
			while(false!==($file=readdir($handle)))if(is_file('lang/'.$file))$files[]=$file;
			closedir($handle);
			sort($files);
			$kfm_available_languages=array();
			foreach($files as $f)$kfm_available_languages[]=str_replace('.js','',$f);
		}
		else{
			echo 'error: missing language files';
			exit;
		}
	}
	{ # check for URL parameter "lang"
		if(isset($_GET['lang'])&&$_GET['lang']&&in_array($_GET['lang'],$kfm_available_languages)){
			$kfm_language=$_GET['lang'];
			$_SESSION['kfm']['language']=$kfm_language;
		}
	}
	{ # check session for language selected earlier
		if(
			$kfm_language==''&&
			isset($_SESSION['kfm']['language'])&&
			$_SESSION['kfm']['language']!=''&&
			in_array($_SESSION['kfm']['language'],$kfm_available_languages)
		)$kfm_language=$_SESSION['kfm']['language'];
	}
	{ # check the browser's http headers for preferred languages
		if($kfm_language==''){
			$langs=explode(',',$_SERVER['HTTP_ACCEPT_LANGUAGE']);
			foreach($langs as $lang)if(in_array($lang,$kfm_available_languages)){
				$kfm_language=$lang;
				break;
			}
		}
	}
	{ # check the kfm_preferred_languages
		if($kfm_language=='')foreach($kfm_preferred_languages as $lang)if(in_array($lang,$kfm_available_languages)){
			$kfm_language=$lang;
			break;
		}
	}
	{ # still no language chosen? use the first available one then
		if($kfm_language=='')$kfm_language=$kfm_available_languages[0];
	}
}
{ # make a few corrections to the config where necessary
	foreach($kfm_editable_extensions as $v)if(!in_array($v,$kfm_viewable_extensions))$kfm_viewable_extensions[]=$v;
}
{ # common functions
	function kfm_checkAddr($addr){
		return (
			strpos($addr,'..')===false&&
			!in_array(preg_replace('/.*\./','',$addr),$GLOBALS['kfm_banned_extensions'])
		);
	}
	function get_mimetype($f){
		# windows users, please install this first: http://gnuwin32.sourceforge.net/packages/file.htm
		return shell_exec(trim('file -bi '.escapeshellarg($f)));
	}
}
require_once('framework.php');
{ # directory functions
	function kfm_add_directory_to_db($name,$physical_address,$parent){
		require_once('includes/directories.php');
		return _add_directory_to_db($name,$physical_address,$parent);
	}
	function kfm_createDirectory($parent,$name){
		require_once('includes/directories.php');
		return _createDirectory($parent,$name);
	}
	function kfm_deleteDirectory($id,$recursive=0){
		require_once('includes/directories.php');
		return _deleteDirectory($id,$recursive);
	}
	function kfm_getDirectoryDbInfo($id){
		require_once('includes/directories.php');
		return _getDirectoryDbInfo($id);
	}
	function kfm_getDirectoryProperties($dir){
		require_once('includes/directories.php');
		return _getDirectoryProperties($dir);
	}
	function kfm_moveDirectory($from,$to){
		require_once('includes/directories.php');
		return _moveDirectory($from,$to);
	}
	function kfm_loadDirectories($root){
		require_once('includes/directories.php');
		return _loadDirectories($root);
	}
	function kfm_rmdir2($dir){
		require_once('includes/directories.php');
		return _rmdir2($dir);
	}
}
{ # file functions
	function kfm_add_file_to_db($filename,$directory_id){
		require_once('includes/files.php');
		return _add_file_to_db($filename,$directory_id);
	}
	function kfm_createEmptyFile($filename){
		require_once('includes/files.php');
		return _createEmptyFile($filename);
	}
	function kfm_downloadFileFromUrl($url,$filename){
		require_once('includes/files.php');
		return _downloadFileFromUrl($url,$filename);
	}
	function kfm_extractZippedFile($id){
		require_once('includes/files.php');
		return _extractZippedFile($id);
	}
	function kfm_getFileAsArray($filename){
		require_once('includes/files.php');
		return _getFileAsArray($filename);
	}
	function kfm_getFileDetails($filename){
		require_once('includes/files.php');
		return _getFileDetails($filename);
	}
	function kfm_getTagName($id){
		require_once('includes/files.php');
		return _getTagName($id);
	}
	function kfm_getTextFile($filename){
		require_once('includes/files.php');
		return _getTextFile($filename);
	}
	function kfm_getFileUrl($fid){
		require_once('includes/files.php');
		return _getFileUrl($fid);
	}
	function kfm_moveFiles($files,$dir_id){
		require_once('includes/files.php');
		return _moveFiles($files,$dir_id);
	}
	function kfm_loadFiles($rootid=1){
		require_once('includes/files.php');
		return _loadFiles($rootid);
	}
	function kfm_renameFile($filename,$newfilename){
		require_once('includes/files.php');
		return _renameFile($filename,$newfilename);
	}
	function kfm_renameFiles($files,$template){
		require_once('includes/files.php');
		return _renameFiles($files,$template);
	}
	function kfm_resize_bytes($size){
		require_once('includes/files.php');
		return _resize_bytes($size);
	}
	function kfm_rm($files,$no_dir=0){
		require_once('includes/files.php');
		return _rm($files,$no_dir);
	}
	function kfm_saveTextFile($filename,$text){
		require_once('includes/files.php');
		return _saveTextFile($filename,$text);
	}
	function kfm_search($keywords,$tags){
		require_once('includes/files.php');
		return _search($keywords,$tags);
	}
	function kfm_tagAdd($recipients,$tagList){
		require_once('includes/files.php');
		return _tagAdd($recipients,$tagList);
	}
	function kfm_tagRemove($recipients,$tagList){
		require_once('includes/files.php');
		return _tagRemove($recipients,$tagList);
	}
	function kfm_viewTextFile($fileid){
		require_once('includes/files.php');
		return _viewTextFile($fileid);
	}
}
{ # image functions
	function kfm_changeCaption($filename,$newCaption){
		require_once('includes/images.php');
		return _changeCaption($filename,$newCaption);
	}
	function kfm_getThumbnail($fileid,$width,$height){
		require_once('includes/images.php');
		return _getThumbnail($fileid,$width,$height);
	}
	function kfm_resizeImage($filename,$width,$height){
		require_once('includes/images.php');
		return _resizeImage($filename,$width,$height);
	}
	function kfm_rotateImage($filename,$direction){
		require_once('includes/images.php');
		return _rotateImage($filename,$direction);
	}
}
{ # JSON
	if(!function_exists('json_encode')){ # php-json is not installed
		require_once('pear/JSON.php');
		require_once('includes/json.php');
	}
}
?>
