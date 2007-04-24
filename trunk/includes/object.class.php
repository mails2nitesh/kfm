<?php
class Object{
	var $error_array = array();
	function __construct(){
		$this->Object();
	}
	function Object(){
		global $kfmdb, $kfm_db_prefix;
		$this->db=&$kfmdb;
		$this->db_prefix=&$kfm_db_prefix;
	}
	function error($message){
		$this->error_array[] = $message;
	}
	function hasErrors(){
		if(count($this->error_array)) return true;
		return false;
	}
	function getErrors(){
		// short term ugly solution
		return 'error: '.implode("_", $this->error_array);
	}
}
?>
