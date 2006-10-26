<?php
class Image extends File{
	var $caption = '';
	function __construct($file){
		if(is_object($file) && $file->isImage()){
			parent::__construct($file->id);
		}else if(is_numeric($file)){
			parent::__construct($file);
			
		}else{
			return false;
		}
	}

}
?>
