<?php
class kfmObject{
	var $error_array = array();
	function __construct(){
		$this->kfmObject();
	}
	function kfmObject(){
		global $kfmdb,$kfm_db_prefix,$kfm_db_type;
		$this->db=&$kfmdb;
		$this->db_prefix=&$kfm_db_prefix;
		$this->db_type=&$kfm_db_type;
	}
	function error($message){
		$this->error_array[] = $message;
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
