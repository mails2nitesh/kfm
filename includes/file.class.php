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

	function File(){
		global $db,$kfm_db_prefix;
		if(func_num_args()==1){
			$this->id=func_get_arg(0);
			$qf=$db->query("SELECT ".$kfm_db_prefix."files.id AS id,".$kfm_db_prefix."files.name AS name,".$kfm_db_prefix."directories.physical_address AS directory
				FROM ".$kfm_db_prefix."files,".$kfm_db_prefix."directories
				WHERE ".$kfm_db_prefix."files.id=".$this->id." AND ".$kfm_db_prefix."directories.id=".$kfm_db_prefix."files.directory");
			$filedata = $qf->fetchRow();
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
	function delete(){
		global $db,$kfm_db_prefix;
		if(unlink($this->path)){
			$db->exec("DELETE FROM ".$kfm_db_prefix."files WHERE id=".$this->id);
		}else{
			$this->error("unable to delete file ".$this->name);
		}
		return !$this->hasErrors();
	}
	function getSize(){
		if(!$this->size)$this->size=filesize($this->path);
		return $this->size;
	}
	function getTags(){
		global $db,$kfm_db_prefix;
		$q=$db->query("select tag_id from ".$kfm_db_prefix."tagged_files where file_id=".$this->id);
		$arr=array();
		foreach($q->fetchAll() as $r)$arr[]=$r['tag_id'];
		return $arr;
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

	function getUrl(){
		global $rootdir, $kfm_userfiles_output;
		$cwd=str_replace($rootdir,'',$_SESSION['kfm']['currentdir']);
		if(!file_exists($this->path))return 'javascript:alert("missing file")';
		if($kfm_userfiles_output=='get.php')
			$url=preg_replace('/browser\.php.*/','get.php?id='.$this->id,$_SERVER['REQUEST_URI']);
		else 
			$url=str_replace('//','/',$kfm_userfiles_output.'/'.$cwd.'/'.$this->name);
		return $url;
	}
}
?>
