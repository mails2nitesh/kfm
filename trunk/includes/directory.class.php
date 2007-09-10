<?php
$kfmDirectoryInstances=array();
class kfmDirectory extends kfmObject{
	var $subDirs=array();
	function kfmDirectory($id=1){
		parent::__construct();
		$this->id=$id;
		$res=db_fetch_row("SELECT * FROM ".$this->db_prefix."directories WHERE id=".$this->id);
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
		if(!$GLOBALS['kfm_allow_directory_create'])return $this->error(kfm_lang('permissionDeniedCreateDirectory'));
		$physical_address=$this->path.$name;
		$short_version=str_replace($GLOBALS['rootdir'],'',$physical_address);
		if(!$this->checkAddr($physical_address)){
			$this->error(kfm_lang('illegalDirectoryName',$short_version));
			return false;
		}
		if(file_exists($physical_address)){
			$this->error(kfm_lang('alreadyExists',$short_version));
			return false;
		}
		mkdir($physical_address);
		if(!file_exists($physical_address)){
			$this->error(kfm_lang('failedCreateDirectoryCheck',$name));
			return false;
		}
		return $this->addSubdirToDB($name);
	}
	function delete(){
		if(!$GLOBALS['kfm_allow_directory_delete'])return $this->error(kfm_lang('permissionDeniedDeleteDirectory'));
		$q=$this->db->query("select id from ".$this->db_prefix."files where directory=".$this->id);
		$files=$this->getFiles();
		foreach($files as $f){
			$f->delete();
			if($f->hasErrors())$this->addErrors($f);
		}
		$subdirs=$this->getSubdirs();
		foreach($subdirs as $subdir){
			$subdir->delete();
			if($subdir->hasErrors())$this->addErrors($subdir);
		}
		rmdir($this->path);
		if(is_dir($this->path))$this->error('failed to delete directory '.$this->path);
		if(!$this->hasErrors())$this->db->exec("delete from ".$this->db_prefix."directories where id=".$this->id);
		else return false;
	}
	function getFiles(){
		$this->handle=opendir($this->path);
		if(!$this->handle)return $this->error('unable to open directory');
		$filesdb=db_fetch_all("select * from ".$this->db_prefix."files where directory=".$this->id);
		$fileshash=array();
		if(is_array($filesdb))foreach($filesdb as $r)$fileshash[$r['name']]=$r['id'];
		$files=array();
		while(false!==($filename=readdir($this->handle)))if($filename[0]!='.'&&is_file($this->path.$filename)){
			if(in_array(strtolower($filename),$GLOBALS['kfm_banned_files']))continue;
			if(!isset($fileshash[$filename]))$fileshash[$filename]=kfm_add_file_to_db($filename,$this->id);
			$file=kfmFile::getInstance($fileshash[$filename]);
			if(!$file)continue;
			if($file->isImage())$file=kfmImage::getInstance($fileshash[$filename]);
			$files[]=$file;
			unset($fileshash[$filename]);
		}
		return $files;
	}
	function getInstance($id=1){
		global $kfmDirectoryInstances;
		if(!isset($kfmDirectoryInstances[$id]))$kfmDirectoryInstances[$id]=new kfmDirectory($id);
		return $kfmDirectoryInstances[$id];
	}
	function getPath(){
		$pathTmp=$this->name.'/';
		$pid=$this->pid;
		if(!$pid)return $GLOBALS['rootdir'];
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
		$dirsdb=db_fetch_all("select id,name from ".$this->db_prefix."directories where parent=".$this->id);
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
		if(!$GLOBALS['kfm_allow_directory_move'])return $this->error(kfm_lang('permissionDeniedMoveDirectory'));
		if(is_numeric($newParent)) $newParent = kfmDirectory::getInstance($newParent);
		if(strpos($newParent->path,$this->path)===0) return $this->error(kfm_lang('cannotMoveIntoSelf'));
		if(file_exists($newParent->path.$this->name))return $this->error(kfm_lang('alreadyExists',$newParent->path.$this->name));
		if(!$newParent->isWritable()) return $this->error(kfm_lang('isNotWritable',$newParent->path));
		rename($this->path,$newParent->path.$this->name);
		if(!file_exists($newParent->path.$this->name))return $this->error(kfm_lang('couldNotMoveDirectory',$this->path,$newParent->path.$this->name));
		$this->db->exec("update ".$this->db_prefix."directories set parent=".$newParent->id." where id=".$this->id) or die('error: '.print_r($kfmdb->errorInfo(),true));
	}
	function rename($newname){
		global $kfm_allow_directory_edit;
		if(!$GLOBALS['kfm_allow_directory_edit'])return $this->error(kfm_lang('permissionDeniedEditDirectory'));
		if(!$this->isWritable())return $this->error(kfm_lang('permissionDeniedRename',$this->name));
		if(!$this->checkAddr($newname))return $this->error(kfm_lang('cannotRenameFromTo',$this->name,$newname));
		$parent=kfmDirectory::getInstance($this->pid);
		if(file_exists($parent->path.$newname))return $this->error(kfm_lang('aDirectoryNamedAlreadyExists',$newname));
		rename($this->path,$parent->path.$newname);
		if(file_exists($this->path))return $this->error(kfm_lang('failedRenameDirectory'));
		$this->db->query("update ".$this->db_prefix."directories set name='".addslashes($newname)."' where id=".$this->id);
		$this->name=$newname;
	}
}
?>
