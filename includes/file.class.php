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
	var $size;
	var $type;

	function __construct(){
		if(func_num_args()==1){
			global $db;
			$file_id = func_get_arg(0);
			$qf=$db->query("SELECT files.id AS id, files.name AS name, directories.physical_address AS directory FROM files, directories WHERE files.id='$file_id' AND directories.id = files.directory");
			$filedata = $qf->fetch();
			$this->id = $filedata['id'];
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
			$this->size = filesize($this->path);
		}
	}
	function isWritable(){
		if($this->id==-1) return false;
		if(is_writable($this->path)) return true;
		else return false;
	}
	function getContent(){
		if($this->id==-1) return false;
		$content  = file_get_contents($this->path);
		return $content;
	}
	
	/* Function that returns the extension of the file.
	 * if a parameter is given, the extension of that parameters is returned
	 * returns false on error.
	 */
	function getExtension(){
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
	function isImage(){
		if(in_array($this->getExtension(),array('jpg', 'jpeg', 'gif', 'png', 'bmp'))) return true;
		return false;
	}
	function setContent($content){
		$result = file_put_contents($this->path, $content);
		if(!$result) $this->error('error setting file content');
	}
}
?>
