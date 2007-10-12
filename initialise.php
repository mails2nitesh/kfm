<?php
# see license.txt for licensing
define('KFM_BASE_PATH',dirname(__FILE__).'/');

{ # load classes and helper functions
	require KFM_BASE_PATH.'includes/lang.php';
	require KFM_BASE_PATH.'includes/db.php';
	require KFM_BASE_PATH.'includes/object.class.php';
	require KFM_BASE_PATH.'includes/session.class.php';
	require KFM_BASE_PATH.'includes/file.class.php';
	require KFM_BASE_PATH.'includes/image.class.php';
	require KFM_BASE_PATH.'includes/directory.class.php';
}
function kfm_dieOnError($error){
	if(!PEAR::isError($error))return;
	echo '<strong>Error</strong><br />'.$error->getMessage().'<br />'.$error->userinfo.'<hr />';
	var_dump($error);
	exit;
}

if(get_magic_quotes_gpc()){
	# taken from http://www.phpfreaks.com/quickcode/Get-rid-of-magic_quotes_gpc/618.php
	function traverse (&$arr){
		if(!is_array($arr))return;
		foreach($arr as $key=>$val){
			if(is_array($arr[$key]))traverse($arr[$key]);
			else $arr[$key]=stripslashes($arr[$key]);
		}
	}
	$gpc=array(&$_GET,&$_POST,&$_COOKIE);
	traverse($gpc);
}
set_include_path(KFM_BASE_PATH.'includes/pear'.PATH_SEPARATOR.get_include_path());
if(!file_exists(KFM_BASE_PATH.'configuration.php')){
	echo '<em>Missing <code>configuration.php</code>!</em><p>If this is a fresh installation of KFM, then please rename <code>configuration.php.dist</code> to <code>configuration.php</code>, and edit it according to your project\'s needs.</p><p>If this is an upgraded version of KFM, please remove the parts of your old <code>config.php</code> which do not exist in <code>configuration.php.dist</code>, then rename it to <code>configuration.php</code>.</p>';
	exit;
}
require_once(KFM_BASE_PATH.'configuration.php');
{ # defines
	define('KFM_DB_PREFIX',$kfm_db_prefix);
}

{ # check for fatal errors
	$m=array();
	if(ini_get('safe_mode'))$m[]='KFM does not work if you have <code>safe_mode</code> enabled. This is not a bug - please see <a href="http://ie.php.net/features.safe-mode">PHP.net\'s safe_mode page</a> for details';
	if(!isset($kfm_allow_directory_create))$m[]='missing <code>$kfm_allow_directory_create</code> variable';
	if(!isset($kfm_allow_directory_delete))$m[]='missing <code>$kfm_allow_directory_delete</code> variable';
	if(!isset($kfm_allow_directory_edit))$m[]='missing <code>$kfm_allow_directory_edit</code> variable';
	if(!isset($kfm_allow_directory_move))$m[]='missing <code>$kfm_allow_directory_move</code> variable';
	if(!isset($kfm_allow_file_create))$m[]='missing <code>$kfm_allow_file_create</code> variable';
	if(!isset($kfm_allow_file_delete))$m[]='missing <code>$kfm_allow_file_delete</code> variable';
	if(!isset($kfm_allow_file_edit))$m[]='missing <code>$kfm_allow_file_edit</code> variable';
	if(!isset($kfm_allow_file_move))$m[]='missing <code>$kfm_allow_file_move</code> variable';
	if(!isset($kfm_allow_file_upload))$m[]='missing <code>$kfm_allow_file_upload</code> variable';
	if(!isset($kfm_allow_image_manipulation))$m[]='missing <code>$kfm_allow_image_manipulation</code> variable';
	if(!isset($kfm_only_allow_image_upload))$m[]='missing <code>$kfm_only_allow_image_upload</code> variable';
	if(!isset($kfm_show_disabled_contextmenu_links))$m[]='missing <code>$kfm_show_disabled_contextmenu_links</code> variable';
	if(!isset($kfm_use_multiple_file_upload))$m[]='missing <code>$kfm_use_multiple_file_upload</code> variable';
	if(!isset($kfm_use_imagemagick))$m[]='missing <code>$kfm_use_imagemagick</code> variable';
	if(!isset($kfm_slideshow_delay))$m[]='missing <code>$kfm_slideshow_delay</code> variable';
	if(!isset($kfm_db_port))$m[]='missing <code>$kfm_db_port</code> variable';
	if(!isset($kfm_root_folder_name))$m[]='missing <code>$kfm_root_folder_name</code> variable';
	if(!isset($kfm_files_name_length_displayed))$m[]='missing <code>$kfm_files_name_length_displayed</code> variable';
	if(!isset($kfm_default_upload_permission))$m[]='missing <code>$kfm_default_upload_permission</code> variable';
	if(!isset($kfm_return_file_id_to_cms))$m[]='missing <code>$kfm_return_file_id_to_cms</code> variable';
	if(!isset($kfm_listview))$m[]='missing <code>$kfm_listview</code> variable';
	if(count($m)){
		echo '<html><body><p>There are errors in your configuration or server. If the messages below describe missing variables, please check the supplied <code>configuration.php.dist</code> for notes on their usage.</p><ul>';
		foreach($m as $a)echo '<li>'.$a.'</li>';
		echo '</li></ul></body></html>';
		exit;
	}
}


{ # API - for programmers only
	if(file_exists(KFM_BASE_PATH.'api/config.php'))include(KFM_BASE_PATH.'api/config.php');
	if(file_exists(KFM_BASE_PATH.'api/cms_hooks.php'))include_once(KFM_BASE_PATH.'api/cms_hooks.php');
	else include_once(KFM_BASE_PATH.'api/cms_hooks.php.dist');
}
{ # variables
	if(!isset($kfm_show_files_in_groups_of))$kfm_show_files_in_groups_of=10;
	define('KFM_VERSION',rtrim(file_get_contents(KFM_BASE_PATH.'docs/version.txt')));
	if(!isset($_SERVER['DOCUMENT_ROOT'])){ # fix for IIS
		$_SERVER['DOCUMENT_ROOT']=preg_replace('/\/[^\/]*$/','',str_replace('\\','/',$_SERVER['SCRIPT_FILENAME']));
	}
	$rootdir=$_SERVER['DOCUMENT_ROOT'].$kfm_userfiles.'/';
	if(!is_dir($rootdir))mkdir($rootdir,0755);
	if(!is_dir($rootdir)){
		echo 'error: "'.htmlspecialchars($rootdir).'" could not be created';
		exit;
	}
	$rootdir=realpath($rootdir).'/';
	define('LSQUIGG','{');
	define('RSQUIGG','}');
	define('KFM_DIR', dirname(__FILE__));
	if(!defined('GET_PARAMS')) define('GET_PARAMS', '');
	if(!isset($kfm_banned_folders)||!is_array($kfm_banned_folders)) $kfm_banned_folders = array();
	define('IMAGEMAGICK_PATH',isset($kfm_imagemagick_path)?$kfm_imagemagick_path:'/usr/bin/convert');
	$cache_directories=array();
}
{ # work directory
	if($kfm_workdirectory[0]=='/'){
		$workpath=$kfm_workdirectory;
	}
	else{
		$workpath=$rootdir.$kfm_workdirectory;
	}
	$workurl=$kfm_userfiles_output.$kfm_workdirectory;
	$workdir=true;
	if(substr($workpath,-1)!='/') $workpath.='/';
	if(substr($workurl,-1)!='/') $workurl.='/';
	define('WORKPATH', $workpath);
	define('WORKURL', $workurl);
	if(is_dir($workpath)){
		if(!is_writable($workpath)){
			echo 'error: "'.htmlspecialchars($workpath).'" is not writable';
			exit;
		}
	}else{
		# Support for creating the directory
		$workpath_tmp=substr($workpath,0,-1);
		if(is_writable(dirname($workpath_tmp)))mkdir($workpath_tmp, 0755);
		else{
			echo 'error: could not create directory <code>"'.htmlspecialchars($workpath_tmp).'"</code>. please make sure that <code>'.htmlspecialchars(preg_replace('#/[^/]*$#','',$workpath_tmp)).'</code> is writable by the server';
			exit;
		}
	}
}
{ # database
	$db_defined=0;
	$kfm_db_prefix_escaped=str_replace('_','\\\\_',KFM_DB_PREFIX);
	$port=($kfm_db_port=='')?'':':'.$kfm_db_port;
	switch($kfm_db_type){
		case 'mysql': {
			require_once('MDB2.php');
			$dsn='mysql://'.$kfm_db_username.':'.$kfm_db_password.'@'.$kfm_db_host.$port.'/'.$kfm_db_name;
			$kfmdb=&MDB2::connect($dsn);
			if(PEAR::isError($kfmdb)){
				$dsn='mysql://'.$kfm_db_username.':'.$kfm_db_password.'@'.$kfm_db_host;
				$kfmdb=&MDB2::connect($dsn);
				kfm_dieOnError($kfmdb);
				$kfmdb->query('CREATE DATABASE '.$kfm_db_name.' CHARACTER SET UTF8');
				$kfmdb->disconnect();
				$dsn='mysql://'.$kfm_db_username.':'.$kfm_db_password.'@'.$kfm_db_host.'/'.$kfm_db_name;
				$kfmdb=&MDB2::connect($dsn);
				kfm_dieOnError($kfmdb);
			}
			$kfmdb->setFetchMode(MDB2_FETCHMODE_ASSOC);
			if(!$db_defined){
				$res=&$kfmdb->query("show tables like '".$kfm_db_prefix_escaped."%'");
				kfm_dieOnError($res);
				if(!$res->numRows())include(KFM_BASE_PATH.'scripts/db.mysql.create.php');
				else $db_defined=1;
			}
			break;
		}
		case 'pgsql': {
			require_once('MDB2.php');
			$dsn='pgsql://'.$kfm_db_username.':'.$kfm_db_password.'@'.$kfm_db_host.$port.'/'.$kfm_db_name;
			$kfmdb=&MDB2::connect($dsn);
			if(PEAR::isError($kfmdb)){
				$dsn='pgsql://'.$kfm_db_username.':'.$kfm_db_password.'@'.$kfm_db_host;
				$kfmdb=&MDB2::connect($dsn);
				kfm_dieOnError($kfmdb);
				$kfmdb->query('CREATE DATABASE '.$kfm_db_name);
				$kfmdb->disconnect();
				$dsn='pgsql://'.$kfm_db_username.':'.$kfm_db_password.'@'.$kfm_db_host.'/'.$kfm_db_name;
				$kfmdb=&MDB2::connect($dsn);
				kfm_dieOnError($kfmdb);
			}
			$kfmdb->setFetchMode(MDB2_FETCHMODE_ASSOC);
			if(!$db_defined){
				$res=&$kfmdb->query("SELECT tablename from pg_tables where tableowner=current_user AND tablename NOT LIKE E'pg\\\\_%' AND tablename NOT LIKE E'sql\\\\_%' AND tablename LIKE E'".$kfm_db_prefix_escaped."%'");
				kfm_dieOnError($res);
				if($res->numRows()<1)include(KFM_BASE_PATH.'scripts/db.pgsql.create.php');
				else $db_defined=1;
			}
			break;
		}
		case 'sqlite': {
			require_once('MDB2.php');
			$kfmdb_create = false;
			define('DBNAME',$kfm_db_name);
			if(!file_exists(WORKPATH.DBNAME))$kfmdb_create=true;
			$dsn=array('phptype'=>'sqlite','database'=>WORKPATH.DBNAME,'mode'=>'0644');
			$kfmdb=&MDB2::connect($dsn);
			kfm_dieOnError($kfmdb);
			$kfmdb->setFetchMode(MDB2_FETCHMODE_ASSOC);
			if($kfmdb_create)include(KFM_BASE_PATH.'scripts/db.sqlite.create.php');
			$db_defined=1;
			break;
		}
		case 'sqlitepdo': {
			$kfmdb_create=false;
			define('DBNAME',$kfm_db_name);
			if(!file_exists(WORKPATH.DBNAME))$kfmdb_create=true;
			$dsn=array('type'=>'sqlitepdo','database'=>WORKPATH.DBNAME,'mode'=>'0644');
			$kfmdb=new DB($dsn);
			if($kfmdb_create)include(KFM_BASE_PATH.'scripts/db.sqlite.create.php');
			$db_defined=1;
			break;
		}
		default: {
			echo "unknown database type specified ($kfm_db_type)";
			exit;
		}
	}
	if(!$db_defined){
		echo 'failed to connect to database';
		exit;
	}
}
{ # get kfm parameters and check for updates
	$kfm_parameters=array();
	$rs=db_fetch_all("select * from ".KFM_DB_PREFIX."parameters");
	foreach($rs as $r)$kfm_parameters[$r['name']]=$r['value'];
	if($kfm_parameters['version']!=KFM_VERSION && file_exists(KFM_BASE_PATH.'scripts/update.'.KFM_VERSION.'.php'))require(KFM_BASE_PATH.'scripts/update.'.KFM_VERSION.'.php');
}
{ # JSON
	if(!function_exists('json_encode')){ # php-json is not installed
		require_once('JSON.php');
		require_once(KFM_BASE_PATH.'includes/json.php');
	}
}
{ # start session
	$session_id=(isset($_GET['kfm_session']))?$_GET['kfm_session']:'';
	$kfm_session=new kfmSession($session_id);
	if($kfm_session->isNew){
		$kfm_session->setMultiple(array('cwd_id'=>1,'language'=>'','username'=>'','password'=>'','loggedin'=>0));
	}
}
{ # check authentication
	if(!isset($kfm_username)||!isset($kfm_password)||($kfm_username==''&&$kfm_password==''))$kfm_session->set('loggedin',1);
	if(!$kfm_session->get('loggedin') && (!isset($kfm_api_auth_override)||!$kfm_api_auth_override)){
		$err='';
		if(isset($_POST['username'])&&isset($_POST['password'])){
			if($_POST['username']==$kfm_username && $_POST['password']==$kfm_password){
				$kfm_session->setMultiple(array('username'=>$_POST['username'],'password'=>$_POST['password'],'loggedin'=>1));
			}
			else $err='<em>Incorrect Password. Please try again, or check your <code>configuration.php</code>.</em>';
		}
		if(!$kfm_session->get('loggedin')){
			include(KFM_BASE_PATH.'includes/login.php');
			exit;
		}
	}
}
{ # languages
	$kfm_language='';
	{ # find available languages
		if($handle=opendir(KFM_BASE_PATH.'lang')){
			$files=array();
			while(false!==($file=readdir($handle)))if(is_file(KFM_BASE_PATH.'lang/'.$file))$files[]=$file;
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
			$kfm_session->set('language',$kfm_language);
		}
	}
	{ # check session for language selected earlier
		if(
			$kfm_language==''&&
			!is_null($kfm_session->get('language'))&&
			$kfm_session->get('language')!=''&&
			in_array($kfm_session->get('language'),$kfm_available_languages)
		)$kfm_language=$kfm_session->get('language');
	}
	{ # check the browser's http headers for preferred languages
		if($kfm_language==''){
			if(!isset($_SERVER['HTTP_ACCEPT_LANGUAGE']))$_SERVER['HTTP_ACCEPT_LANGUAGE']='';
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
			strpos($addr,'.')!==0&&
			strlen($addr)>0&&
			$addr[strlen($addr)-1]!=' '&&
			strpos($addr,'/.')===false&&
			!in_array(preg_replace('/.*\./','',$addr),$GLOBALS['kfm_banned_extensions'])
		);
	}
	function get_mimetype($f){
		$mimetypes=array('ez'=>'application/andrew-inset','hqx'=>'application/mac-binhex40','cpt'=>'application/mac-compactpro','doc'=>'application/msword','bin'=>'application/octet-stream','dms'=>'application/octet-stream','lha'=>'application/octet-stream','lzh'=>'application/octet-stream','exe'=>'application/octet-stream','class'=>'application/octet-stream','so'=>'application/octet-stream','dll'=>'application/octet-stream','oda'=>'application/oda','pdf'=>'application/pdf','ai'=>'application/postscript','eps'=>'application/postscript','ps'=>'application/postscript','smi'=>'application/smil','smil'=>'application/smil','mif'=>'application/vnd.mif','xls'=>'application/vnd.ms-excel','ppt'=>'application/vnd.ms-powerpoint','wbxml'=>'application/vnd.wap.wbxml','wmlc'=>'application/vnd.wap.wmlc','wmlsc'=>'application/vnd.wap.wmlscriptc','bcpio'=>'application/x-bcpio','vcd'=>'application/x-cdlink','pgn'=>'application/x-chess-pgn','cpio'=>'application/x-cpio','csh'=>'application/x-csh','dcr'=>'application/x-director','dir'=>'application/x-director','dxr'=>'application/x-director','dvi'=>'application/x-dvi','spl'=>'application/x-futuresplash','gtar'=>'application/x-gtar','hdf'=>'application/x-hdf','js'=>'application/x-javascript','skp'=>'application/x-koan','skd'=>'application/x-koan','skt'=>'application/x-koan','skm'=>'application/x-koan','latex'=>'application/x-latex','nc'=>'application/x-netcdf','cdf'=>'application/x-netcdf','sh'=>'application/x-sh','shar'=>'application/x-shar','swf'=>'application/x-shockwave-flash','sit'=>'application/x-stuffit','sv4cpio'=>'application/x-sv4cpio','sv4crc'=>'application/x-sv4crc','tar'=>'application/x-tar','tcl'=>'application/x-tcl','tex'=>'application/x-tex','texinfo'=>'application/x-texinfo','texi'=>'application/x-texinfo','t'=>'application/x-troff','tr'=>'application/x-troff','roff'=>'application/x-troff','man'=>'application/x-troff-man','me'=>'application/x-troff-me','ms'=>'application/x-troff-ms','ustar'=>'application/x-ustar','src'=>'application/x-wais-source','xhtml'=>'application/xhtml+xml','xht'=>'application/xhtml+xml','zip'=>'application/zip','au'=>'audio/basic','snd'=>'audio/basic','mid'=>'audio/midi','midi'=>'audio/midi','kar'=>'audio/midi','mpga'=>'audio/mpeg','mp2'=>'audio/mpeg','mp3'=>'audio/mpeg','aif'=>'audio/x-aiff','aiff'=>'audio/x-aiff','aifc'=>'audio/x-aiff','m3u'=>'audio/x-mpegurl','ram'=>'audio/x-pn-realaudio','rm'=>'audio/x-pn-realaudio','rpm'=>'audio/x-pn-realaudio-plugin','ra'=>'audio/x-realaudio','wav'=>'audio/x-wav','pdb'=>'chemical/x-pdb','xyz'=>'chemical/x-xyz','bmp'=>'image/bmp','gif'=>'image/gif','ief'=>'image/ief','jpeg'=>'image/jpeg','jpg'=>'image/jpeg','jpe'=>'image/jpeg','png'=>'image/png','tiff'=>'image/tiff','tif'=>'image/tiff','djvu'=>'image/vnd.djvu','djv'=>'image/vnd.djvu','wbmp'=>'image/vnd.wap.wbmp','ras'=>'image/x-cmu-raster','pnm'=>'image/x-portable-anymap','pbm'=>'image/x-portable-bitmap','pgm'=>'image/x-portable-graymap','ppm'=>'image/x-portable-pixmap','rgb'=>'image/x-rgb','xbm'=>'image/x-xbitmap','xpm'=>'image/x-xpixmap','xwd'=>'image/x-xwindowdump','igs'=>'model/iges','iges'=>'model/iges','msh'=>'model/mesh','mesh'=>'model/mesh','silo'=>'model/mesh','wrl'=>'model/vrml','vrml'=>'model/vrml','css'=>'text/css','html'=>'text/html','htm'=>'text/html','asc'=>'text/plain','txt'=>'text/plain','rtx'=>'text/richtext','rtf'=>'text/rtf','sgml'=>'text/sgml','sgm'=>'text/sgml','tsv'=>'text/tab-separated-values','wml'=>'text/vnd.wap.wml','wmls'=>'text/vnd.wap.wmlscript','etx'=>'text/x-setext','xsl'=>'text/xml','xml'=>'text/xml','mpeg'=>'video/mpeg','mpg'=>'video/mpeg','mpe'=>'video/mpeg','qt'=>'video/quicktime','mov'=>'video/quicktime','mxu'=>'video/vnd.mpegurl','avi'=>'video/x-msvideo','movie'=>'video/x-sgi-movie','ice'=>'x-conference/x-cooltalk');
		$extension=preg_replace('/.*\./','',$f);
		if(isset($mimetypes[$extension]))return $mimetypes[$extension];
		return 'unknown/mimetype';
	}
}
{ # directory functions
	function kfm_add_directory_to_db($name,$parent){
		require_once(KFM_BASE_PATH.'includes/directories.php');
		return _add_directory_to_db($name,$parent);
	}
	function kfm_createDirectory($parent,$name){
		require_once(KFM_BASE_PATH.'includes/directories.php');
		return _createDirectory($parent,$name);
	}
	function kfm_deleteDirectory($id,$recursive=0){
		require_once(KFM_BASE_PATH.'includes/directories.php');
		return _deleteDirectory($id,$recursive);
	}
	function kfm_getDirectoryDbInfo($id){
		require_once(KFM_BASE_PATH.'includes/directories.php');
		return _getDirectoryDbInfo($id);
	}
	function kfm_getDirectoryParents($pid,$type=1){
		require_once(KFM_BASE_PATH.'includes/directories.php');
		return _getDirectoryParents($pid,$type);
	}
	function kfm_moveDirectory($from,$to){
		require_once(KFM_BASE_PATH.'includes/directories.php');
		return _moveDirectory($from,$to);
	}
	function kfm_renameDirectory($dir,$newname){
		require_once(KFM_BASE_PATH.'includes/directories.php');
		return _renameDirectory($dir,$newname);
	}
	function kfm_loadDirectories($root,$oldpid=0){
		require_once(KFM_BASE_PATH.'includes/directories.php');
		return _loadDirectories($root,$oldpid);
	}
	function kfm_rmdir($dir){
		require_once(KFM_BASE_PATH.'includes/directories.php');
		return _rmdir($dir);
	}
}
{ # file functions
	function kfm_add_file_to_db($filename,$directory_id){
		require_once(KFM_BASE_PATH.'includes/files.php');
		return _add_file_to_db($filename,$directory_id);
	}
	function kfm_copyFiles($files,$dir_id){
		require_once(KFM_BASE_PATH.'includes/files.php');
		return _copyFiles($files,$dir_id);
	}
	function kfm_createEmptyFile($cwd,$filename){
		require_once(KFM_BASE_PATH.'includes/files.php');
		return _createEmptyFile($cwd,$filename);
	}
	function kfm_downloadFileFromUrl($url,$filename){
		require_once(KFM_BASE_PATH.'includes/files.php');
		return _downloadFileFromUrl($url,$filename);
	}
	function kfm_extractZippedFile($id){
		require_once(KFM_BASE_PATH.'includes/files.php');
		return _extractZippedFile($id);
	}
	function kfm_getFileAsArray($filename){
		require_once(KFM_BASE_PATH.'includes/files.php');
		return _getFileAsArray($filename);
	}
	function kfm_getFileDetails($filename){
		require_once(KFM_BASE_PATH.'includes/files.php');
		return _getFileDetails($filename);
	}
	function kfm_getTagName($id){
		require_once(KFM_BASE_PATH.'includes/files.php');
		return _getTagName($id);
	}
	function kfm_getTextFile($filename){
		require_once(KFM_BASE_PATH.'includes/files.php');
		return _getTextFile($filename);
	}
	function kfm_getFileUrl($fid,$x=0,$y=0){
		require_once(KFM_BASE_PATH.'includes/files.php');
		return _getFileUrl($fid,$x,$y);
	}
	function kfm_moveFiles($files,$dir_id){
		require_once(KFM_BASE_PATH.'includes/files.php');
		return _moveFiles($files,$dir_id);
	}
	function kfm_loadFiles($rootid=1){
		require_once(KFM_BASE_PATH.'includes/files.php');
		return _loadFiles($rootid);
	}
	function kfm_renameFile($filename,$newfilename){
		require_once(KFM_BASE_PATH.'includes/files.php');
		return _renameFile($filename,$newfilename);
	}
	function kfm_renameFiles($files,$template){
		require_once(KFM_BASE_PATH.'includes/files.php');
		return _renameFiles($files,$template);
	}
	function kfm_resize_bytes($size){
		require_once(KFM_BASE_PATH.'includes/files.php');
		return _resize_bytes($size);
	}
	function kfm_rm($files,$no_dir=0){
		require_once(KFM_BASE_PATH.'includes/files.php');
		return _rm($files,$no_dir);
	}
	function kfm_saveTextFile($filename,$text){
		require_once(KFM_BASE_PATH.'includes/files.php');
		return _saveTextFile($filename,$text);
	}
	function kfm_search($keywords,$tags){
		require_once(KFM_BASE_PATH.'includes/files.php');
		return _search($keywords,$tags);
	}
	function kfm_tagAdd($recipients,$tagList){
		require_once(KFM_BASE_PATH.'includes/files.php');
		return _tagAdd($recipients,$tagList);
	}
	function kfm_tagRemove($recipients,$tagList){
		require_once(KFM_BASE_PATH.'includes/files.php');
		return _tagRemove($recipients,$tagList);
	}
	function kfm_zip($name,$files){
		require_once(KFM_BASE_PATH.'includes/files.php');
		return _zip($name,$files);
	}
}
{ # image functions
	function kfm_changeCaption($filename,$newCaption){
		require_once(KFM_BASE_PATH.'includes/images.php');
		return _changeCaption($filename,$newCaption);
	}
	function kfm_getThumbnail($fileid,$width,$height){
		require_once(KFM_BASE_PATH.'includes/images.php');
		return _getThumbnail($fileid,$width,$height);
	}
	function kfm_resizeImage($filename,$width,$height){
		require_once(KFM_BASE_PATH.'includes/images.php');
		return _resizeImage($filename,$width,$height);
	}
	function kfm_rotateImage($filename,$direction){
		require_once(KFM_BASE_PATH.'includes/images.php');
		return _rotateImage($filename,$direction);
	}
	function kfm_cropToOriginal($fid,$x1, $y1, $width, $height){
		require_once(KFM_BASE_PATH.'includes/images.php');
		return _cropToOriginal($fid,$x1, $y1, $width, $height);
	}
	function kfm_cropToNew($fid,$x1, $y1, $width, $height, $newname){
		require_once(KFM_BASE_PATH.'includes/images.php');
		return _cropToNew($fid,$x1, $y1, $width, $height, $newname);
	}
}
?>
