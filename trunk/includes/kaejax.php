<?
{ # variables
	$kaejax_js_has_been_shown=0;
	$kaejax_export_list=array();
	$kaejax_is_loaded=strstr($_SERVER['REQUEST_URI'],'kaejax_is_loaded');
}	
function kaejax_get_js_repr($value=''){
	$type=gettype($value);
	if($type=='boolean'||$type=='integer')return 'parseInt('.$value.')';
	elseif($type=='double')return 'parseFloat('.$value.')';
	elseif($type=='array'||$type=='object'){
		if($type=='array'){
			$isNumeric=1;
			foreach(array_keys($value) as $key)if(!is_numeric($key))$isNumeric=0;
		}
		if($type=='array'&&$isNumeric){
			$arr=array();
			foreach($value as $k=>$v)$arr[]=kaejax_get_js_repr($v);
			return '['.join(',',$arr).']';
		}
		$s='';
		if($type=='object')$value=get_object_vars($value);
		foreach($value as $k=>$v){
			$esc_key=kaejax_esc($k);
			if(is_numeric($k))$s.=$k.':'.kaejax_get_js_repr($v).',';
			else $s.=$esc_key.':'.kaejax_get_js_repr($v).',';
		}
		return '('.LSQUIGG.substr($s,0,-1).RSQUIGG.')';
	} 
	else{
		$esc_val=kaejax_esc($value);
		$s='"'.utf8_encode($esc_val).'"';
		return $s;
	}
}
function kaejax_handle_client_request(){
	if(!isset($_POST['kaejax']))return;
	require_once('JSON.php');
	$json=new Services_JSON();
	$obj=$json->decode(stripslashes($_POST['kaejax']));
	$fs=$obj->c;
	if(!is_array($fs)){ # something wrong
		echo "error: unknown data sent from client.\n\n";
		print_r($_POST['kaejax']);
		exit;
	}
	$res=array();
	foreach($fs as $f)$res[]=call_user_func_array($f->f,$f->v);
	echo $json->encode($res);
	exit;
}
function kaejax_esc($val){
	return str_replace(array("\\","\r","\n",'"'),array("\\\\","\\r","\\n",'\\"'),$val);
}
function kaejax_get_one_stub($func_name){
	$a='function x_'.$func_name.'()'.LSQUIGG.'kaejax_do_call("'.$func_name.'",arguments);'.RSQUIGG.'function_urls.'.$func_name."='".$_SERVER['REQUEST_URI']."';";
	if(!$GLOBALS['kaejax_is_loaded'])$a.='kaejax_is_loaded=1;';
	$GLOBALS['kaejax_is_loaded']=1;
	return $a;
}
function kaejax_export(){
	global $kaejax_export_list;
	$n=func_num_args();
	for($i=0;$i<$n;$i++)$kaejax_export_list[]=func_get_arg($i);
}
function kaejax_get_javascript(){
	$html='';
	if(!$GLOBALS['kaejax_js_has_been_shown']&&!$GLOBALS['kaejax_is_loaded'])$GLOBALS['kaejax_js_has_been_shown']=1;
	foreach($GLOBALS['kaejax_export_list'] as $func)$html.=kaejax_get_one_stub($func);
	return $html;
}
?>
