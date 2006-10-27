<?php
class Image extends File{
	var $caption = '';
	var $width;
	var $height;
	var $thumb_url;
	var $thumb_path;
	var $info = array();  // info from getimagesize
	
	function __construct($file){
		if(is_object($file) && $file->isImage()){
			parent::__construct($file->id);
		}else if(is_numeric($file)){
			parent::__construct($file);
			
		}else{
			return false;
		}
		// TODO select image data and set the properties
		$this->caption = 'Not yet available';
		$this->info = getimagesize($this->path);
		$this->width = $this->info[0];
		$this->height = $this->info[1];
		$this->setThumbnail();
	}
	
	function setCaption($caption){
		// Add to database
		// $this->caption = $caption;
	}
	
	function setThumbnail($width=64, $height=64){

		$thumbname =$this->id.' '.$width.'x'.$height.' '.$this->name;
		if(!in_array($this->type,array('jpeg', 'gif', 'png'))) return false;
		$this->thumb_url = WORKURL.$thumbname;
		$this->thumb_path = WORKPATH.$thumbname;
		if(!file_exists($this->thumb_path)) $this->createThumb($width, $height);
	}
	
	function createThumb($width=64, $height=64){
		$this->deleteThumbs();
		$load='imagecreatefrom'.$this->type;
		$save='image'.$this->type;
		$ratio = min($width/$this->width, $height/$this->height);
		$thumb_width = $this->width*$ratio;
		$thumb_height = $this->height*$ratio;
		if(!function_exists($load)||!function_exists($save))$this->error('server cannot handle image of type "'.$this->type.'"');
		$im = $load($this->path);
		$thumb = imagecreatetruecolor($thumb_width,$thumb_height);
		imagecopyresampled($thumb,$im,0,0,0,0,$thumb_width,$thumb_height,$this->width,$this->height);
		$save($thumb,$this->thumb_path,($this->type=='jpeg'?100:9));
		imagedestroy($thumb); 
		imagedestroy($im);
	}
	
	function resize($new_width, $new_height=-1){
		if(!$this->isWritable()){
			$this->error('Image is not writable, so cannot be resized');
			return false;
		}
		$this->deleteThumbs();
		if($new_height==-1)$new_height = $this->height*$new_width/$this->width;
		$load='imagecreatefrom'.$this->type;
		$save='image'.$this->type;
		$im = $load($this->path);
		$imresized=imagecreatetruecolor($new_width,$new_height);
		imagecopyresampled($imresized,$im,0,0,0,0,$new_width,$new_height,$this->width,$this->height);
		$save($imresized,$this->path,($this->type=='jpeg'?100:9));
		imagedestroy($imresized); 
		imagedestroy($im);
	}
	
	function rotate($direction){
		if(!$this->isWritable()){
			$this->error('Image is not writable, so cannot be rotated');
			return false;
		}
		$this->deleteThumbs();
		$load='imagecreatefrom'.$this->type;
		$save='image'.$this->type;
		$im  =  $load($this->path);
		$im=imagerotate($im,$direction,0);
		$save($im,$this->path,($this->type=='jpeg'?100:9));
		imagedestroy($im);
	}
	function deleteThumbs(){
		$icons=glob(WORKPATH.$this->id.' [0-9]*x[0-9]*.*');
		foreach($icons as $f)unlink($f);
	}
}
?>
