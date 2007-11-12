<?php
$fileInstances=array();
class kfmFile extends kfmObject{
	var $ctime='';
	var $directory='';
	var $exists=0;
	var $id=-1;
	var $mimetype='';
	var $name='';
	var $parent=0;
	var $path='';
	var $size=0;
	var $type;
	var $writable=false;
	function kfmFile(){
		if(func_num_args()==1){
			$this->id=func_get_arg(0);
			parent::kfmObject();
			$filedata=db_fetch_row("SELECT id,name,directory FROM ".KFM_DB_PREFIX."files WHERE id=".$this->id);
			$this->name=$filedata['name'];
			$this->parent=$filedata['directory'];
			$dir=kfmDirectory::getInstance($this->parent);
			$this->directory=$dir->path;
			$this->path=$dir->path.'/'.$filedata['name'];
			if(!$this->exists()){
				$this->error('File cannot be found');
				$this->delete();
				return false;
			}
			$this->writable=$this->isWritable();
			$this->ctime=filemtime($this->path);
			$mimetype=get_mimetype($this->path);
			$pos=strpos($mimetype,';');
			$this->mimetype=($pos===false)?$mimetype:substr($mimetype,0,$pos);
			$this->type=trim(substr(strstr($this->mimetype,'/'),1));
		}
	}
	function checkAddr($addr){
		return (
			strpos($addr,'..')===false&&
			strpos($addr,'.')!==0&&
			strpos($addr,'/')===false &&
			!in_array(preg_replace('/.*\./','',$addr),$GLOBALS['kfm_banned_extensions'])
			);
	}
	function exists(){
		if($this->exists)return $this->exists;
		$this->exists=file_exists($this->path);
		return $this->exists;
	}
	function getContent(){
		return ($this->id==-1)?false:utf8_encode(file_get_contents($this->path));
	}
	function getExtension(){
		/* Function that returns the extension of the file.
		 * if a parameter is given, the extension of that parameters is returned
		 * returns false on error.
		 */
		if(func_num_args()==1){
			$filename=func_get_arg(0);
		}else{
			if($this->id==-1)return false;
			$filename=$this->name;
		}
		$dotext=strrchr($filename,'.');
		if($dotext === false) return false;
		return strtolower(substr($dotext,1));
	}
	function getUrl($x=0,$y=0){
		global $rootdir, $kfm_userfiles_output,$kfm_workdirectory;
		$cwd=$this->directory.'/'==$rootdir?'':str_replace($rootdir,'',$this->directory);
		if(!$this->exists())return 'javascript:alert("missing file")';
		if(preg_replace('/.*(get\.php)$/','$1',$kfm_userfiles_output)=='get.php'){
			if($kfm_userfiles_output=='get.php')$url=preg_replace('/\/[^\/]*$/','/get.php?id='.$this->id.GET_PARAMS,$_SERVER['REQUEST_URI']);
			else $url=$kfm_userfiles_output.'?id='.$this->id;
			if($x&&$y)$url.='&width='.$x.'&height='.$y;
		}
		else{
			if($this->isImage()&&$x&&$y){
				$img=kfmImage::getInstance($this);
				$img->setThumbnail($x,$y);
				return $kfm_userfiles_output.$kfm_workdirectory.'/thumbs/'.$img->thumb_id;
			}
			else $url=$kfm_userfiles_output.'/'.$cwd.'/'.$this->name; # TODO: check this line - $cwd may be incorrect if the requested file is from a search
		}
		return preg_replace('/([^:])\/{2,}/','$1/',$url);
	}
	function delete(){
		global $kfm_allow_file_delete;
		if(!$kfm_allow_file_delete)return $this->error(kfm_lang('permissionDeniedDeleteFile'));
		if(!kfm_cmsHooks_allowedToDeleteFile($this->id))return $this->error(kfm_lang('CMSRefusesFileDelete',$this->path));
		if($this->exists() && !$this->writable)return $this->error(kfm_lang('fileNotMovableUnwritable',$this->name));
		if(!$this->exists() || unlink($this->path))$this->db->exec("DELETE FROM ".KFM_DB_PREFIX."files WHERE id=".$this->id);
		else return $this->error(kfm_lang('failedDeleteFile',$this->name));
		return true;
	}
	function move($dir_id){
		global $kfmdb;
		if(!$this->writable)return $this->error(kfm_lang('fileNotMovableUnwritable',$this->name));
		$dir=kfmDirectory::getInstance($dir_id);
		if(!$dir)return $this->error(kfm_lang('failedGetDirectoryObject'));
		if(!rename($this->path,$dir->path.'/'.$this->name))return $this->error(kfm_lang('failedMoveFile',$this->name));
		$q=$kfmdb->query("update ".KFM_DB_PREFIX."files set directory=".$dir_id." where id=".$this->id);
	}
	function getInstance($id=0){
		global $fileInstances;
		if(!$id)return false;
		if(is_object($id))$id=$id->id;
		if(!isset($fileInstances[$id]))$fileInstances[$id]=new kfmFile($id);
		if($fileInstances[$id]->isImage())return kfmImage::getInstance($id);
		return $fileInstances[$id];
	}
	function getSize(){
		if(!$this->size)$this->size=filesize($this->path);
		return $this->size;
	}
	function getTags(){
		$arr=array();
		$tags=db_fetch_all("select tag_id from ".KFM_DB_PREFIX."tagged_files where file_id=".$this->id);
		foreach($tags as $r)$arr[]=$r['tag_id'];
		return $arr;
	}
	function isImage(){
		return in_array($this->getExtension(),array('jpg', 'jpeg', 'gif', 'png', 'bmp'));
	}
	function isWritable(){
		return (($this->id==-1)||!is_writable($this->path))?false:true;
	}
	function rename($newName){
		global $kfm_allow_file_edit;
		if(!$kfm_allow_file_edit)return $this->error(kfm_lang('permissionDeniedEditFile'));
		if(!kfm_checkAddr($newName))return $this->error(kfm_lang('cannotRenameFromTo',$this->name,$newName));
		$newFileAddress=$this->directory.$newName;
		if(file_exists($newFileAddress))return $this->error(kfm_lang('fileAlreadyExists'));
		rename($this->path,$newFileAddress);
		$this->name=$newName;
		$this->path=$newFileAddress;
		$this->db->query("UPDATE ".KFM_DB_PREFIX."files SET name='".sql_escape($newName)."' WHERE id=".$this->id);
	}
	function setContent($content){
		global $kfm_allow_file_edit;
		if(!$kfm_allow_file_edit)return $this->error(kfm_lang('permissionDeniedEditFile'));
		$result=file_put_contents($this->path,utf8_decode($content));
		if(!$result)$this->error(kfm_lang('errorSettingFileContent'));
	}
	function setTags($tags){
		if(!count($tags))return;
		$this->db->exec("DELETE FROM ".KFM_DB_PREFIX."tagged_files WHERE file_id=".$this->id);
		foreach($tags as $tag)$this->db->exec("INSERT INTO ".KFM_DB_PREFIX."tagged_files (file_id,tag_id) VALUES(".$this->id.",".$tag.")");
	}
	function size2str(){
		# returns the size in a human-readable way
		# expects input size in bytes
	 	# if no input parameter is given, the size of the file object is returned 
		$size=func_num_args()?func_get_arg(0):$this->getSize();
		if(!$size)return '0';
		$format=array("B","KB","MB","GB","TB","PB","EB","ZB","YB");
		$n=floor(log($size)/log(1024));
		return $n?round($size/pow(1024,$n),1).' '.$format[$n]:'0 B';
	}
	function addToDb($filename, $directory_id){
		global $kfmdb;
		$sql="insert into ".KFM_DB_PREFIX."files (name,directory) values('".sql_escape($filename)."',".$directory_id.")";
		$q=$kfmdb->query($sql);
		return $kfmdb->lastInsertId(KFM_DB_PREFIX.'files','id');
	}
	function checkName($filename=false){
		if($filename===false)$filename=$this->name;
		if(trim($filename)=='')return false;
		if($filename[0]=='.')return false;
		
		foreach($GLOBALS['kfm_banned_files'] as $ban){
			if(($ban[0]=='/' || $ban[0]=='@')&&preg_match($ban,$filename))return false;
			elseif($ban==strtolower(trim($filename)))return false;
		}
		if(isset($GLOBALS['kfm_allowed_files']) && is_array($GLOBALS['kfm_allowed_files']))
			foreach($GLOBALS['kfm_allowed_files'] as $allow)if(!preg_match($allow, $filename))return false;

		return true;
	}
}
?>
