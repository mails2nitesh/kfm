<?php
class Object{
	var $errors = array();
	function error($message){
		$this->errors[] = $message;
	}
}
?>