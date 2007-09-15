<?php
# see docs/license.txt for licensing
require_once('initialise.php');
require_once($kfm_base_path.'includes/kaejax.php');
header('Content-type: text/html; Charset=utf-8');

{ # export kaejax stuff
	kfm_kaejax_export(
		'kfm_changeCaption','kfm_copyFiles','kfm_createDirectory','kfm_createEmptyFile','kfm_deleteDirectory','kfm_downloadFileFromUrl',
		'kfm_extractZippedFile','kfm_getFileDetails','kfm_getFileUrl','kfm_getTagName','kfm_getTextFile','kfm_getThumbnail','kfm_loadDirectories',
		'kfm_loadFiles','kfm_moveDirectory','kfm_moveFiles','kfm_renameDirectory','kfm_renameFile','kfm_renameFiles','kfm_resizeImage','kfm_rm',
		'kfm_rotateImage','kfm_saveTextFile','kfm_search','kfm_tagAdd','kfm_tagRemove','kfm_viewTextFile','kfm_zip'
	);
	if(!empty($_POST['kaejax']))kfm_kaejax_handle_client_request();
}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
	<head>
		<style type="text/css">@import "themes/<?php echo $kfm_theme; ?>/kfm.css";</style>
		<title>KFM - Kae's File Manager</title>
		<script type="text/javascript">
			var kfm_vars={
				root_folder_name:"<?php echo $kfm_root_folder_name; ?>",
				show_disabled_contextmenu_links:<?php echo $kfm_show_disabled_contextmenu_links; ?>,
				use_multiple_file_upload:<?php echo $kfm_use_multiple_file_upload; ?>,
				permissions:{
					dir:{
						ed:<?php echo $kfm_allow_directory_edit; ?>,
						mk:<?php echo $kfm_allow_directory_create; ?>,
		   				mv:<?php echo $kfm_allow_directory_move; ?>,
						rm:<?php echo $kfm_allow_directory_delete; ?>
					},
					file:{
						rm:<?php echo $kfm_allow_file_delete; ?>,
						ed:<?php echo $kfm_allow_file_edit; ?>,
		   				mk:<?php echo $kfm_allow_file_create; ?>,
		   				mv:<?php echo $kfm_allow_file_move; ?>
					},
					image:{
						manip:<?php echo $kfm_allow_image_manipulation; ?>
					}
				}
			};
		</script>
		<script type="text/javascript" src="j/mootools.v1.11/mootools.v1.11.js"></script>
		<?php
			if(isset($kfm_dev)){
				$js_files=array('variables.js','notice.js','kfm.js','alerts.js','modal.dialog.js',
					'contextmenu.js','directories.js','file.selections.js','file.text-editing.js',
					'images.and.icons.js','panels.js','tags.js','common.js','kaejax_replaces.js',
					'file.class.js','files.js','resize_handler.js');
				echo '<script type="text/javascript" src="j/'.join("\"></script>\n		<script type=\"text/javascript\" src=\"j/",$js_files).'"></script>'."\n";
			}
			else echo '<script type="text/javascript" src="j/all.php"></script>';
		?>
		<script type="text/javascript" src="j/swfuploadr52_0002/swfupload.js"></script>
		<script type="text/javascript" src="lang/<?php echo $kfm_language; ?>.js"></script>
		<script type="text/javascript">
			var phpsession = "<?php echo session_id(); ?>";
			var session_key="<?php echo $kfm_session->key; ?>";
			var starttype="<?php echo isset($_GET['type'])?$_GET['type']:''; ?>";
			var fckroot="<?php echo $kfm_userfiles; ?>";
			var fckrootOutput="<?php echo $kfm_userfiles_output; ?>";
			var kfm_file_handler="<?php echo $kfm_file_handler; ?>";
			var kfm_log_level=<?php echo $kfm_log_level; ?>;
			var kfm_return_directory=<?php echo isset($_GET['return_directory'])?'1':'0'; ?>;
			var kfm_theme="<?php echo $kfm_theme; ?>";
			var kfm_hidden_panels="<?php echo $kfm_hidden_panels; ?>".split(',');
			var kfm_show_files_in_groups_of=<?php echo $kfm_show_files_in_groups_of; ?>;
			var kfm_slideshow_delay=<?php echo ((int)$kfm_slideshow_delay)*1000; ?>;
			for(var i=0;i<kfm_hidden_panels.length;++i)kfm_hidden_panels[i]='kfm_'+kfm_hidden_panels[i]+'_panel';
			<?php echo kfm_kaejax_get_javascript(); ?>
			<?php if(isset($_GET['kfm_caller_type']))echo 'window.kfm_caller_type="'.addslashes($_GET['kfm_caller_type']).'";'; ?>
			var editable_extensions=["<?php echo join('","',$kfm_editable_extensions);?>"];
			var viewable_extensions=["<?php echo join('","',$kfm_viewable_extensions);?>"];
		</script>
	</head>
	<body>
		<p>Please Wait - loading...</p>
		<noscript>KFM relies on JavaScript. Please either turn on JavaScript in your browser, or <a href="http://www.getfirefox.com/">get Firefox</a> if your browser does not support JavaScript.</noscript>
		<?php
			if(!$kfm_dont_send_metrics){
				$today=date('Y-m-d');
				$last_registration=isset($kfm_parameters['last_registration'])?$kfm_parameters['last_registration']:'';
				if($last_registration!=$today){
					echo '<img src="http://kfm.verens.com/extras/register.php?version='.urlencode(KFM_VERSION).'&amp;domain_name='.urlencode($_SERVER['SERVER_NAME']).'&amp;db_type='.$kfm_db_type.'" />';
					$kfmdb->query("delete from ".$kfm_db_prefix."parameters where name='last_registration'");
					$kfmdb->query("insert into ".$kfm_db_prefix."parameters (name,value) values ('last_registration','".$today."')");
					$kfm_parameters['last_registration']=$today;
				}
			}
		?>
	</body>
</html>
