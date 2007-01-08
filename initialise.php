<?php
# see license.txt for licensing
error_reporting(E_USER_ERROR | E_USER_WARNING | E_USER_NOTICE);
session_start();

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
	define('KFM_VERSION', '0.7.1');
	$rootdir=str_replace('//','/',$_SERVER['DOCUMENT_ROOT'].$kfm_userfiles.'/');
	if(!file_exists($rootdir.$kfm_workdirectory))mkdir($rootdir.$kfm_workdirectory);
	if(!isset($_SESSION['kfm']))$_SESSION['kfm']=array(
		'currentdir'=>rtrim($rootdir,' /'),
		'cwd_id'=>1,
		'language'=>''
	);
	define('LSQUIGG','{');
	define('RSQUIGG','}');
	$kfm_highlight_extensions=array('php'=>'PHP', 'html'=>'HTML', 'xhtml'=>'HTML',
				 'sql'=>'MYSQL', 'js'=>'JAVASCRIPT', 'css'=>'CSS', 'xml'=>'XML');
	$kfm_banned_files = array('thumbs.db','.ds_store'); # lowercase array
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
	$db_defined=0;
	switch($kfm_db_type){
		case 'mysql': {
			require_once('MDB2.php');
			$dsn='mysql://'.$kfm_db_username.':'.$kfm_db_password.'@'.$kfm_db_host.'/'.$kfm_db_name;
			$db=&MDB2::factory($dsn);
			if(PEAR::isError($db))die($db->getMessage());
			$db->setFetchMode(MDB2_FETCHMODE_ASSOC);
			$res=&$db->query("show tables like '".$kfm_db_prefix."%'");
			if(!$res->numRows())include('scripts/db.mysql.create.php');
			else $db_defined=1;
			break;
		}
		case 'pgsql': {
			require_once('MDB2.php');
			$dsn='pgsql://'.$kfm_db_username.':'.$kfm_db_password.'@'.$kfm_db_host.'/'.$kfm_db_name;
			$db=&MDB2::factory($dsn);
			if(PEAR::isError($db))die($db->getMessage());
			$db->setFetchMode(MDB2_FETCHMODE_ASSOC);
			$res=&$db->query("SELECT tablename from pg_tables where tableowner=current_user AND tablename NOT LIKE 'pg_%' AND tablename NOT LIKE 'sql_%' AND tablename LIKE '".$kfm_db_prefix."%'");
			if($res->numRows()<1)include('scripts/db.pgsql.create.php');
			else $db_defined=1;
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
			$db_defined=1;
			break;
		}
		default: {
			echo "unknown database type specified ($kfm_db_type)"; # TODO: new string
			exit;
		}
	}
	if(!$db_defined){
		echo 'failed to connect to database'; # TODO: new string
		exit;
	}
	$db_defined=null;
}
{ # get kfm parameters and check for updates
	$kfm_parameters=array();
	$q=$db->query("select * from ".$kfm_db_prefix."parameters");
	$rs=$q->fetchAll();
	foreach($rs as $r)$kfm_parameters[$r['name']]=$r['value'];
	if($kfm_parameters['version']!=KFM_VERSION)require 'scripts/update.0.7.1.php';
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
	if(!function_exists('mime_content_type')){
		function mime_content_type($f){
			# windows users, please install this first: http://gnuwin32.sourceforge.net/packages/file.htm
			return shell_exec(trim('file -bi '.escapeshellarg($f)));
		}
	}
}
?>
