<?php
require_once('../initialise.php');
require_once('functions.php');
$sprefix='kfm_setting_';
$uid=$kfm->user_id;
$mysets=db_fetch_all('SELECT name FROM '.KFM_DB_PREFIX.'settings WHERE user_id='.$uid);
foreach($mysets as &$myset)$myset=$myset['name'];
?>
<script type="text/javascript">
var sprefix='<?php echo $sprefix;?>';
function change_setting(name,value){
	$.post('setting_change.php',{name:name,value:value},function(res){eval(res);});
}
function style_usersetting(name){
	$('#desc_'+sprefix+name).removeClass().addClass('user_setting');
}
function style_defaultsetting(name){
	$('#desc_'+sprefix+name).removeClass().addClass('default_setting');
}
function change_is_user_setting(name, is){
	$.post('settings_isuser_change.php',{sname:name,isuser:is},function(res){eval(res);});
}
function setting_default_value(name){
	$.post('setting_make_default.php', {sname:name},function(res){eval(res);});
}
function setting_select_list(name, option, checked){
	checked=checked?1:0;
	$.post('setting_change.php',{name:name,value:option,checked:checked},function(res){eval(res);});
}
</script>
<?php
$js='';
$str='<div class="settings_container"><table class="settings_table">
<thead>
	<tr>
		<th>Setting name</th>
		<th>Setting value</th>
		<th>User setting</th>
	</tr>
</thead>
<tbody>';
foreach($kfm->sdef as $sname=>$sdef){
	if($kfm->user_status!=1 && !$kfm->isUserSetting($sname)) continue;
	//$sname=$sdef['name'];
	$svalue=$kfm->setting($sname);
	$sprops=isset($sdef->properties)?$sdef['properties']:array();
	$sunit=isset($sdef['unit'])?$sdef['unit']:'';
	$gh=$sdef['type']=='group_header'?1:0;
	
	$ismyset=in_array($sname,$mysets);
	$str.="\n\t<tr>";
	if($gh){
		$str.='
		<td colspan="3"><span class="group_header">'.$sname.'</span></td></tr>';
	}else{
		$str.='
		<td><span id="desc_'.$sprefix.$sname.'" class="'.($ismyset?'user_setting':'default_setting').'">'.$sname.'</span></td>
		<td>';
		switch($sdef['type']){
			case 'text':
			case 'integer':
				$str.=form_input('text',$sname, $svalue, $sprops);	
				break;
			case 'bool':
				$str.=form_bool($sname, $svalue);
				break;
			case 'array':
				$str.=form_array($sname,$svalue,$sprops);
				break;
			case 'choice_list':
				$str.=form_choice_list($sname, $svalue, $sdef['options']);
				break;
			case 'select_list':
				$str.='<div id="select_list_'.$sname.'_container" class="select_list_container">';
				$str.=form_select_list($sname, $svalue, $sdef['options']);
				$str.='</div>';
				break;
			default:
				die('Error with setting '.$sname.'. Type '.$sdef['type'].' does not exist');
				break;
		}
		$str.=' '.$sunit.'
		</td>';
		if($kfm->user_status==1){
			$str.='<td>';
			$str.=form_user_setting($sname,$kfm->isUserSetting($sname));
			$str.='</td>';
		}
		$str.='
		<td>';
			if($kfm->user_id!=1)$str.='
				<span onclick="setting_default_value(\''.$sname.'\')" id="todefault_'.$sname.'" class="button"'.
				($ismyset?'':' style="display:none;"').
				'>Back to default</span>';
		$str.='
		</td>
		</tr>';
	}
}
$str.='</table></div><br>';
print $str;
?>
