<?php
class kfmDirectory extends Object{
	private static $instances=array();
	var $subDirs=array();
	function kfmDirectory($id=1){
		parent::__construct();
		$this->id=$id;
		$q=$this->db->query("SELECT * FROM ".$this->db_prefix."directories WHERE id=".$this->id);
		$res=$q->fetchRow();
		$this->name=$res['name'];
		$this->pid=$res['parent'];
		$this->path=$this->getPath();
	}
	function __construct($id=1){
		$this->kfmDirectory($id);
	}
	function addSubdirToDB($name){
		$sql="INSERT INTO ".$this->db_prefix."directories (name,parent) VALUES('".addslashes($name)."',".$this->id.")";
		return $this->db->exec($sql);
	}
	function checkAddr($addr){
		return (
			strpos($addr,'..')===false&&
			strpos($addr,'.')!==0&&
			strpos($addr,'/.')===false);
	}
	function createSubdir($name){
		if(!$GLOBALS['kfm_allow_directory_create'])return $this->error('permission denied: cannot create directory'); # TODO: new string
		$short_version=str_replace($GLOBALS['rootdir'],'',$this->path);
		$physical_address=$this->path.$name;
		if(!$this->checkAddr($physical_address)){ $this->error('illegal directory name "'.$short_version.'"'); return false;} # TODO: new string
		if(file_exists($physical_address)){$this->error('a directory named "'.$short_version.'" already exists'); return false;}# TODO: new string
		mkdir($physical_address);
		if(!file_exists($physical_address)){$this->error('failed to create directory "'.$short_version.'". please check permissions'); return false;} # TODO: new string
		return $this->addSubdirToDB($name);
	}
	function delete(){
		if(!$GLOBALS['kfm_allow_directory_delete'])return $this->error('permission denied: cannot delete directory'); # TODO: new string
		$q=$this->db->query("select id from ".$this->db_prefix."files where directory=".$this->id);
		$files=$q->fetchAll();
		foreach($files as $r){
			$f=new File($r['id']);
			$f->delete();
			if($f->hasErrors()) $this->addErrors($f);
		}
		$subdirs=$this->getSubdirs();
		foreach($subdirs as $subdir){
			$subdir->delete();
			if($subdir->hasErrors())$this->addErrors($subdir);
		}
		rmdir($this->path);
		if(is_dir($this->path))$this->error('failed to delete directory '.$this->path);
		if(!$this->hasErrors()){
			$this->db->exec("delete from ".$this->db_prefix."directories where id=".$this->id);
		}else{
			return false;
		}
	}
	function getFiles(){
		$this->handle=opendir($this->path);
		if(!$this->handle)return $this->error('unable to open directory');
		$q=$this->db->query("select * from ".$this->db_prefix."files where directory=".$this->id);
		$filesdb=$q->fetchAll();
		$fileshash=array();
		if(is_array($filesdb))foreach($filesdb as $r)$fileshash[$r['name']]=$r['id'];
		$files=array();
		while(false!==($filename=readdir($this->handle)))if($filename[0]!='.'&&is_file($this->path.$filename)){
			if(in_array(strtolower($filename),$GLOBALS['kfm_banned_files']))continue;
			if(!isset($fileshash[$filename]))$fileshash[$filename]=kfm_add_file_to_db($filename,$this->id);
			$file=new File($fileshash[$filename]);
			if(!$file)continue;
			if($file->isImage())$file=new Image($fileshash[$filename]);
			$files[]=$file;
			unset($fileshash[$filename]);
		}
		foreach($fileshash as $k=>$v){
			// maybe this should happen in de constructor of the file
			#	$f=new File($v);
			#	$f->delete();
		}
		return $files;
	}
	public static function getInstance($id=1){
		if(!isset(self::$instances[$id]))self::$instances[$id]=new kfmDirectory($id);
		return self::$instances[$id];
	}
	function getPath(){
		$pathTmp=$this->name.'/';
		if($this->name=='')$pathTmp='/';
		$pid=$this->pid;
		while($pid>1){
			$p=kfmDirectory::getInstance($pid);
			$pathTmp=$p->name.'/'.$pathTmp;
			$pid=$p->pid;
		}
		return $GLOBALS['rootdir'].$pathTmp;
	}
	function getProperties(){
		return array(
			'allowed_file_extensions' => '',
			'name'                    => $this->name,
			'path'                    => str_replace($_SERVER['DOCUMENT_ROOT'],'',$this->path),
			'parent'                  => $this->pid,
			'is_writable'             => $this->isWritable()
		);
	}
	function getSubdirs($oldstyle=false){
		global $kfm_banned_folders;
		$this->handle=opendir($this->path);
		$q=$this->db->query("select id,name from ".$this->db_prefix."directories where parent=".$this->id);
		$dirsdb=$q->fetchAll();
		$dirshash=array();
		if(is_array($dirsdb))foreach($dirsdb as $r)$dirshash[$r['name']]=$r['id'];
		$directories=array();
		while(false!==($file=readdir($this->handle))){
			if(in_array(strtolower($file), $kfm_banned_folders)) continue;
			if(is_dir($this->path.$file)&&$file[0]!=='.'){
				if(!isset($dirshash[$file])){
					$this->addSubdirToDB($file);
					$dirshash[$file]=$this->db->lastInsertId($this->db_prefix.'directories','id');
				}
				$directories[]=kfmDirectory::getInstance($dirshash[$file]);
				unset($dirshash[$file]);
			}
		}
		return $directories;
	}
	function hasSubdirs(){
		$this->handle=opendir($this->path);
		if($this->handle){
			while(false!==($file=readdir($this->handle))){
				if($file[0]!=='.' && is_dir($this->path.$file) && !in_array(strtolower($file),$GLOBALS['kfm_banned_folders'])) return true;
			}
			return false;
		}else{
			$this->error('Directory could not be opened');
		}
	}
	function isWritable(){
		return is_writable($this->path);	
	}
	function moveTo($newParent){
		if(!$GLOBALS['kfm_allow_directory_move'])return $this->error('permission denied: cannot move directory'); # TODO: new string
		if(is_numeric($newParent)) $newParent = kfmDirectory::getInstance($newParent);
		if(strpos($newParent->path,$this->path)===0) return $this->error('cannot move a directory into its own sub-directory');# TODO: new string 
		if(file_exists($newParent->path.$this->name))return $this->error($newParent->path.$this->name.' already exists'); # TODO: new string
		if(!$newParent->isWritable()) return $this->error($newParent->path.' is not writable'); #TODO: new string
		rename($this->path,$newParent->path.$this->name);
		if(!file_exists($newParent->path.$this->name))return $this->error('could not move directory "'.$this->path.'" to "'.$newParent->path.$this->name.'"'); # TODO: new string
		$this->db->exec("update ".$this->db_prefix."directories set parent=".$newParent->id." where id=".$this->id) or die('error: '.print_r($kfmdb->errorInfo(),true));
	}
	function rename($newname){
		global $kfm_allow_directory_edit;
		if(!$GLOBALS['kfm_allow_directory_edit'])return $this->error('permission denied: cannot edit directory'); # TODO: new string
		if(!$this->isWritable())return $this->error('cannot rename "'.$this->name.'". No rights'); # TODO: new string
		if(!$this->checkAddr($newname))return $this->error('cannot rename "'.$this->name.'" to "'.$newname.'"'); # TODO: new string
		$parent=kfmDirectory::getInstance($this->pid);
		if(file_exists($parent->path.$newname))return $this->error('a directory of that name already exists'); # TODO: new string
		rename($this->path,$parent->path.$newname);
		if(!file_exists($parent->path.$newname))return $this->error('failed to rename directory'); # TODO: new string
		$this->db->query("update ".$this->db_prefix."directories set name='".addslashes($newname)."' where id=".$this->id);
	}
}
?>
