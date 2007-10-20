<?php
function kfm_isError($level=3){
	global $kfm_errors;
	foreach($kfm_errors as $error) if($error->level<=$level)return true;
	return false;
}
function kfm_getErrors($level=3){
	global $kfm_errors;
	$str='error:';
	foreach($kfm_errors as $error) if($error->level<=$level)$str.='\n - '.$error->message;
	if($str=='error:')return '';
	return $str;
	/* For now a string is returned, but more info is available. 
	 * A function kfm_display_errors(res.errors) should handle the extra available  information in the future*/
}
class kfmObject{
	var $error_array = array();
	function __construct(){
		$this->kfmObject();
	}
	function kfmObject(){
		global $kfmdb,$kfm_db_type;
		$this->db=&$kfmdb;
		$this->db_prefix=KFM_DB_PREFIX;
		$this->db_type=&$kfm_db_type;
	}
	function error($message, $level=3){
		global $kfm_errors;
		$trace=debug_backtrace();
		$info=array_pop($trace);
		$error=array(
			'message'=>$message, 
			'level'=>$level,
			'function'=>$info['function'],
			'class'=>$info['class'],
			'file'=>$info['file']);
		$this->error_array[] = $message;
		$kfm_errors[]=$error;
		return false;
	}
	function hasErrors(){
		if(count($this->error_array)) return true;
		return false;
	}
	function getErrors(){
		// short term ugly solution
		return 'error: '.implode("_", $this->error_array);
	}
	function addErrors($object){
		array_merge_recursive($this->error_array, $object->error_array);
	}
	function checkAddr($addr){
		return (
			strpos($addr,'..')===false&&
			strpos($addr,'.')!==0&&
			strpos($addr,'/.')===false&&
			!in_array(preg_replace('/.*\./','',$addr),$GLOBALS['kfm_banned_extensions'])
		);
	}
}
?>
