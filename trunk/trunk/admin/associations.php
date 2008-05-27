<?php
require_once('../initialise.php');
if($kfm->user_status!=1)die ('No authorization to view this page');
print 'There are '.count($kfm->plugins).' plugins available';
function get_list(){
	global $kfm;
	$str='<select>
	<option>System</option>
	<option>Download</option>';
	foreach($kfm->plugins as $plugin){
		$str.="\n\t".'<option>'.$plugin->name.'</option>';
	}
	$str.='</select>';
	return $str;
}
?>
<table id="association_table">
<thead>
	<tr>
		<th>Extension</th>
		<th>Plugin</th>
	</tr>
</thead>
<tbody>
	<tr>
		<td>txt</td>
		<td><?php echo get_list();?></td>
	</tr>
</tbody>
</table>
