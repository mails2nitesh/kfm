<?php
# see license.txt for licensing
include('config.php');
require_once('framework.php');
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
	function kfm_getFileAsArray($filename){
		require_once('includes/files.php');
		return _getFileAsArray($filename);
	}
	function kfm_getFileDetails($filename){
		require_once('includes/files.php');
		return _getFileDetails($filename);
	}
	function kfm_getTextFile($filename){
		require_once('includes/files.php');
		return _getTextFile($filename);
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
	function kfm_getCaption($dirname,$filename){
		require_once('includes/images.php');
		return _getCaption($dirname,$filename);
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
		'kfm_changeCaption','kfm_createDirectory','kfm_createEmptyFile','kfm_deleteDirectory',
		'kfm_downloadFileFromUrl','kfm_getFileDetails','kfm_getTextFile','kfm_getThumbnail','kfm_loadDirectories',
		'kfm_loadFiles','kfm_moveDirectory','kfm_moveFiles','kfm_renameFile','kfm_resizeImage','kfm_rm','kfm_rotateImage',
		'kfm_saveTextFile','kfm_search','kfm_viewTextFile'
	);
	if(!empty($_POST['kaejax']))kaejax_handle_client_request();
}

?>
<html>
	<head>
		<title>KFM - Kae's File Manager</title>
		<link rel="stylesheet" href="Text/hilight.css" />
		<script type="text/javascript" src="lang/<?php
			echo $kfm_language;
		?>.js"></script>
		<script type="text/javascript" src="kfm.js"></script>
		<script type="text/javascript">
			var starttype="<?php echo isset($_GET['Type'])?$_GET['Type']:''; ?>";
			var fckroot="<?php echo $kfm_userfiles; ?>";
			var fckrootOutput="<?php echo $kfm_userfiles_output; ?>";
			var kfm_log_level=<?php echo $kfm_log_level; ?>;
			var kfm_theme="<?php echo $kfm_theme; ?>";
			<?php echo kaejax_get_javascript(); ?>
			<?php if(isset($_GET['kfm_callerType']))echo 'var window.kfm_callerType="'.addslashes($_GET['kfm_callerType']).'";'; ?>
			var editable_extensions=["<?php echo join('","',$kfm_editable_extensions);?>"];
			var viewable_extensions=["<?php echo join('","',$kfm_viewable_extensions);?>"];
		</script>
		<style type="text/css">@import "<?php
		echo 'themes/'.$kfm_theme.'/kfm.css';
		?>";</style>
	</head>
	<body>
		<noscript>KFM relies on JavaScript. Please either turn on JavaScript in your browser, or <a href="http://www.getfirefox.com/">get Firefox</a> if your browser does not support JavaScript.</noscript>
		<script type="text/javascript">setTimeout('kfm()',10);</script>
	</body>
</html>
