<?php
/* Class File handles 
 *
 */
 
class File extends Object{
	var $id = -1;
	var $name = '';
	var $directory = '';
	var $path = '';
	var $mimetype = '';
	var $size = 0;
	var $type;

	function __construct(){
		if(func_num_args()==1){
			global $db;
			$this->id = func_get_arg(0);
			$qf=$db->query('SELECT files.id AS id, files.name AS name, directories.physical_address AS directory FROM files, directories
				WHERE files.id='.$this->id.' AND directories.id = files.directory');
			$filedata = $qf->fetch();
			$this->name = $filedata['name'];
			$this->directory = $filedata['directory'];
			$this->path = $filedata['directory'].'/'.$filedata['name'];
			if(!file_exists($this->path)){
				$this->error('File cannot be found');
				return false;
			}
			$mimetype = mime_content_type($this->path);
			$pos = strpos($mimetype,';');
			$this->mimetype = ($pos===false)?$mimetype:substr($mimetype,0,$pos);
			$this->type = trim(substr(strstr($this->mimetype,'/'),1));
		}
	}
	function isWritable(){
		return (($this->id==-1)||!is_writable($this->path))?false:true;
	}
	function getContent(){
		return ($this->id==-1)?false:file_get_contents($this->path);
	}
	function getExtension(){
		/* Function that returns the extension of the file.
		 * if a parameter is given, the extension of that parameters is returned
		 * returns false on error.
		 */
		if(func_num_args()==1){
			$filename = func_get_arg(0);
		}else{
			if($this->id==-1)return false;
			$filename = $this->name;
		}
		$dotext = strrchr($filename,'.');
		if($dotext === false) return false;
		return strtolower(substr($dotext,1));
	}
	function getSize(){
		if(!$this->size)$this->size=filesize($this->path);
		return $this->size;
	}
	function isImage(){
		return in_array($this->getExtension(),array('jpg', 'jpeg', 'gif', 'png', 'bmp'));
	}
	function setContent($content){
		$result = file_put_contents($this->path, $content);
		if(!$result) $this->error('error setting file content');
	}

	/* Function that returns the size in a readable way
	 * expects input size in bytes
	 * if no input parameter is given, the size of the file object is taken
	 */
	function size2str(){
		$size = func_num_args()?func_get_arg(0):$this->getSize();
		$format = array("B","KB","MB","GB","TB","PB","EB","ZB","YB");
		$n = floor(log($size)/log(1024));
		return round($size/pow(1024,$n),1).' '.$format[$n];
	}
}
?>
