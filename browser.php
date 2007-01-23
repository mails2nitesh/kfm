<?php
# see license.txt for licensing
require_once('framework.php');
require_once('initialise.php');
require_once('includes/kaejax.php');

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
	function kfm_search($keywords){
		require_once('includes/files.php');
		return _search($keywords);
	}
	function kfm_tagAdd($recipients,$tagList){
		require_once('includes/files.php');
		return _tagAdd($recipients,$tagList);
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
{ # export kaejax stuff
	kaejax_export(
		'kfm_changeCaption','kfm_createDirectory','kfm_createEmptyFile','kfm_deleteDirectory','kfm_downloadFileFromUrl',
		'kfm_extractZippedFile','kfm_getFileDetails','kfm_getFileUrl','kfm_getTagName','kfm_getTextFile','kfm_getThumbnail','kfm_loadDirectories',
		'kfm_loadFiles','kfm_moveDirectory','kfm_moveFiles','kfm_renameFile','kfm_renameFiles','kfm_resizeImage','kfm_rm','kfm_rotateImage',
		'kfm_saveTextFile','kfm_search','kfm_tagAdd','kfm_viewTextFile'
	);
	if(!empty($_POST['kaejax']))kaejax_handle_client_request();
}

?>
<html>
	<head>
		<style type="text/css">@import "<?php
		echo 'themes/'.$kfm_theme.'/kfm.css';
		?>";</style>
		<title>KFM - Kae's File Manager</title>
		<style type="text/css"><?php
			echo preg_replace('/\s+/',' ',file_get_contents('Text/hilight.css'));
		?></style>
		<script type="text/javascript">

<?php
	$js='';
	$js.=file_get_contents('lang/'.$kfm_language.'.js');
	$js.=file_get_contents('j/kfm.js');
	$js.=file_get_contents('j/alerts.js');
	$js.=file_get_contents('j/contextmenu.js');
	$js.=file_get_contents('j/directories.js');
	$js.=file_get_contents('j/file.selections.js');
	$js.=file_get_contents('j/file.text-editing.js');
	$js.=file_get_contents('j/files.js');
	$js.=file_get_contents('j/images.and.icons.js');
	$js.=file_get_contents('j/panels.js');
	$js.=file_get_contents('j/tags.js');
	$js.=file_get_contents('j/tracers.js');
	$js.=file_get_contents('j/common.js');
	{ # browser-specific functions
		require_once('Detect.php');
		$browser=new Net_UserAgent_Detect();
		{ # addEvent
			if($browser->isIE())$js.=file_get_contents('j/addEvent.ie.js');
			else if($browser->getBrowserString()=='Konqueror/Safari')$js.=file_get_contents('j/addEvent.konqueror.js');
			else $js.=file_get_contents('j/addEvent.js');
		}
		{ # getWindow
			if($browser->isIE())$js.=file_get_contents('j/getWindow.ie.js');
			else if($browser->getBrowserString()=='Konqueror/Safari')$js.=file_get_contents('j/getWindow.konqueror.js');
			else $js.=file_get_contents('j/getWindow.js');
		}
		{ # getWindowSize
			if($browser->isIE())$js.=file_get_contents('j/getWindowSize.ie.js');
			else $js.=file_get_contents('j/getWindowSize.js');
		}
	}
	$js=preg_replace('#// .*|[\t]#','',$js); # strip single-line comments and tabs
	$js=preg_replace('#/\*.*?\*/#ims','',$js); # strip multi-line comments
	$js=preg_replace('#;\n}#ims','}',$js);
	$js=preg_replace('#:\n"#ims',':"',$js);
	$jsnew=$js;
	do{
		$redo=0;
		$jsnew=preg_replace('#\n\n#ims',"\n",$jsnew);
		$jsnew=preg_replace('#([{}])\n([{}])#ims','\1\2',$jsnew);
		if($js!=$jsnew)$redo=1;
		$js=$jsnew;
	}while($redo);
	echo $js;
?>
			var starttype="<?php echo isset($_GET['Type'])?$_GET['Type']:''; ?>";
			var fckroot="<?php echo $kfm_userfiles; ?>";
			var fckrootOutput="<?php echo $kfm_userfiles_output; ?>";
			var kfm_file_handler="<?php echo $kfm_file_handler; ?>";
			var kfm_log_level=<?php echo $kfm_log_level; ?>;
			var kfm_theme="<?php echo $kfm_theme; ?>";
			<?php echo kaejax_get_javascript(); ?>
			<?php if(isset($_GET['kfm_callerType']))echo 'window.kfm_callerType="'.addslashes($_GET['kfm_callerType']).'";'; ?>
			var editable_extensions=["<?php echo join('","',$kfm_editable_extensions);?>"];
			var viewable_extensions=["<?php echo join('","',$kfm_viewable_extensions);?>"];
		</script>
	</head>
	<body>
		<noscript>KFM relies on JavaScript. Please either turn on JavaScript in your browser, or <a href="http://www.getfirefox.com/">get Firefox</a> if your browser does not support JavaScript.</noscript>
		<script type="text/javascript">setTimeout('kfm()',10);</script>
		<?php
			if(!$kfm_dont_send_metrics){
				$today=date('Y-m-d');
				if($kfm_parameters['last_registration']!=$today){
					echo '<img src="http://kfm.verens.com/extras/register.php?version='.urlencode(KFM_VERSION).'&amp;domain_name='.urlencode($_SERVER['SERVER_NAME']).'" />';
					$db->query("delete from ".$kfm_db_prefix."parameters where name='last_registration'");
					$db->query("insert into ".$kfm_db_prefix."parameters (name,value) values ('last_registration','".$today."')");
				}
			}
		?>
	</body>
</html>
