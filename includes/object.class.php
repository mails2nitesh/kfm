<?php
class Object{
	var $error_array = array();
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
