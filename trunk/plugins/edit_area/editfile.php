<?php
require_once('../../initialise.php');
if(!isset($_GET['fid']))die ('no file id specified');
$f=new kfmFile($_GET['fid']);
if(!$f)die ('error retrieving file');
switch($f->getExtension()){
	case 'html':
		$lang='html';
		break;
	case 'c':
		$lang='c';
		break;
	case 'cpp':
		$lang='cpp';
		break;
	case 'css':
		$lang='css';
		break;
	case 'js':
		$lang='js';
		break;
	case 'pas':
		$lang='pas';
		break;
	case 'php':
		$lang='php';
		break;
	case 'python':
		$lang='python';
		break;
	case 'sql':
		$lang='sql';
		break;
	case 'vb':
		$lang='vb';
		break;
	case 'xml':
		$lang='xml';
		break;
	default:
		$lang='';
		break;
}
?>
<DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" >
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<title>EditArea - the code editor in a textarea</title>
	<script language="Javascript" type="text/javascript" src="edit_area/edit_area_full.js"></script>
	<script language="Javascript" type="text/javascript">
		editAreaLoader.init({
			id: "editareacontent"
			,start_highlight: true
			,allow_resize: "both"
			,allow_toggle: true
			,language: "en"
			,syntax: "<?php echo $lang;?>"
			,toolbar: "save,charmap,|,search,go_to_line,|,undo,redo,|,select_font,|,syntax_selection,|, change_smooth_selection,highlight,reset_highlight,|,help"
			,save_callback:"save_document"
			,plugins: "charmap"
			,charmap_default: "arrows"
		});
		function save_document(id, content){
			parent.x_kfm_saveTextFile(<?php echo $f->id;?>,content, function(res){
				//parent.kfm_pluginIframeMessage('document saved');	
			});
		}
	</script>
<style type="text/css">
*{
	margin:0;
	padding:0;
}
</style>
<head>
<body>
<textarea id="editareacontent" style="width:100%;height:90%;"><?php echo $f->getContent();?></textarea>
</body>
</html>
