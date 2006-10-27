<?php
class Object{
	var $errors = array();
	function error($message){
		$this->errors[] = $message;
	}
	function errors(){
		if(count($this->errors)) return true;
		return false;
	}
	function getErrors(){
		// short term ugly solution
		implode(" ", $this->errors);
	}
}
?>