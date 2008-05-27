<?php
require_once('../initialise.php');
$du_res=exec('du -s '.$user_root_dir->path);
$du_array=preg_split('/\s+/',$du_res);
$used_space=$du_array[0];
$allowed_space=$kfm->setting('bestandenbox_allowed_space');
$percentage=round($used_space*100/($allowed_space*1024*1024));
$space_desc=kfmFile::size2str($used_space).' used of '.kfmFile::size2str($allowed_space*1024*1024);
$js='var descdiv=$(\'<div>'.$space_desc.'</div>\').addClass("bb_space_description");';
$js.='var graphcontainer=$("<div></div>").addClass("bb_space_graph_container");';
$js.='var graph_empty=$("<div></div>").addClass("bb_space_graph_empty");';
$js.='var graph_used=$("<div><span class=\"bb_space_graph_text\">'.$percentage.'%</span></div>").addClass("bb_space_graph_used").css("width","'.$percentage.'%");';
$js.='graph_empty.append(graph_used);';
$js.='graphcontainer.append(graph_empty);';
$js.='$("#bb_space_view").empty().append(descdiv).append(graphcontainer);';
echo $js;
?>
