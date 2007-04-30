<?php
class kfmDirectory extends Object{
	var $subDirs = array();
	function __construct($id=1){
		$this->kfmDirectory($id);
	}
	function kfmDirectory($id=1){
		parent::__construct();
		$this->id=$id;
		$q=$this->db->query("SELECT * FROM ".$this->db_prefix."directories WHERE id=".$this->id);
		$res = $q->fetchRow();
		$this->name = $res['name'];
		$this->pid = $res['parent'];
		$this->path = $this->getPath();
	}
	function getSubdirs(){
		global $kfm_banned_folders;
		$this->handle = opendir($this->path);
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
				$subDir = new kfmDirectory($dirshash[$file]);
				
				$directories[]=array($subDir->name,$subDir->hasSubdirs(),$dirshash[$file]);
				unset($dirshash[$file]);
			}
		}
		return $directories;
	}
	function addSubdirToDB($name){
		$sql="INSERT INTO ".$this->db_prefix."directories (name,parent) VALUES('".addslashes($name)."',".$this->id.")";
		return $this->db->exec($sql);
	}
	function hasSubdirs(){
		$this->handle = opendir($this->path);
		if($this->handle){
			while(false!==($file=readdir($this->handle))){
				if($file[0]!=='.' && is_dir($this->path.$file)) return true;
			}
			return false;
		}else{
			$this->error('Directory could not be opened');
		}
	}
   function checkAddr($addr){
      return (
         strpos($addr,'..')===false&&
         strpos($addr,'.')!==0&&
         strpos($addr,'/.')===false);
	}
	function createSubdir($name){
			$short_version=str_replace($GLOBALS['rootdir'],'',$this->path);
			$physical_address = $this->path.$name;
			if(!$this->checkAddr($physical_address)){ $this->error('illegal directory name "'.$short_version.'"'); return false;} # TODO: new string
			if(file_exists($physical_address)){$this->error('a directory named "'.$short_version.'" already exists'); return false;}# TODO: new string
			
			mkdir($physical_address);
			if(!file_exists($physical_address)){$this->error('failed to create directory "'.$short_version.'". please check permissions'); return false;} # TODO: new string
			return $this->addSubdirToDB($name);
	}
	function changeName($newname){}

	function moveTo($newParentId){}

	function isWritable(){
		return is_writable($this->path);	
	}

	function getPath(){
		$pathTmp = '';
		$pid = $this->id;
		while($pid>1){
			$q=$this->db->query("SELECT name, parent FROM ".$this->db_prefix."directories WHERE id=".$pid);
			$info=$q->fetchRow();
			$pathTmp=$info['name'].'/'.$pathTmp;
			$pid = $info['parent'];
		}
		return $GLOBALS['rootdir'].$pathTmp;
	}
}
?>
