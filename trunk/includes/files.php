<?
function _add_file_to_db($filename,$directory_id){
	global $db,$db_method;
	$sql='insert into files (name,directory) values("'.addslashes($filename).'",'.$directory_id.')';
	if($db_method=='sqlite'&&$db->getAttribute(PDO::ATTR_SERVER_VERSION)<'3.3'){ # sqlite only supports autoincrement recently
		$q=$db->prepare('select id from files limit 1');
		$id=$q->execute()?'(select id from files order by id desc limit 1)+1':1;
		$sql='insert into files (id,name,directory) values('.$id.',"'.addslashes($filename).'",'.$directory_id.')';
	}
	$q=$db->prepare($sql);
	return $q->execute();
}
function _createEmptyFile($filename){
	if(!kfm_checkAddr($_SESSION['kfm']['currentdir'].'/'.$filename))return 'error: filename not allowed';
	return(touch($_SESSION['kfm']['currentdir'].'/'.$filename))?kfm_loadFiles($_SESSION['kfm']['cwd_id']):'error: could not write file "'.$filename.'"';
}
function _downloadFileFromUrl($url,$filename){
	if(!kfm_checkAddr($_SESSION['kfm']['currentdir'].'/'.$filename))return 'error: filename not allowed';
	if(substr($url,0,4)!='http')return 'error: url must begin with http';
	$file=file_get_contents(str_replace(' ','%20',$url));
	if(!$file)return 'error: could not download file "'.$url.'"';
	return(file_put_contents($_SESSION['kfm']['currentdir'].'/'.$filename,$file))?kfm_loadFiles($_SESSION['kfm']['cwd_id']):'error: could not write file "'.$filename.'"';
}
function _moveFiles($files,$dir_id){
	global $db;
	$q=$db->prepare('select id,physical_address,name from directories where id='.$dir_id);
	$q->execute();
	if(!($dirdata=$q->fetch()))return 'error: no data for directory id "'.$dir_id.'"'; # TODO: new string
	$to=$dirdata['physical_address'].'/';
	if(!kfm_checkAddr($to))return 'error: illegal directory "'.$to.'"'; # TODO: new string
	foreach($files as $fid){
		$q=$db->prepare('select directories.physical_address as da,files.name as fn from files,directories where directories.id=files.directory and files.id='.$fid);
		$q->execute();
		if(!($filedata=$q->fetch()))return 'error: no data for file id "'.$file.'"'; # TODO: new string
		$dir=$filedata['da'];
		$file=$filedata['fn'];
		if(!kfm_checkAddr($dir.'/'.$file))return;
		rename($dir.'/'.$file,$to.'/'.$file);
		$q=$db->prepare('update files set directory='.$dir_id.' where id='.$fid);
		$q->execute();
		/* no longer needed // benjamin
		$icons=glob($dir.'/.files/[0-9]*x[0-9]* '.$file);
		foreach($icons as $f)unlink($f);
		if(file_exists($dir.'/.captions/'.$file)){
			if(!is_dir($to.'/.captions'))mkdir($to.'/.captions',0755);
			rename($dir.'/.captions/'.$file,$to.'/.captions/'.$file);
		}*/
	}
	return kfm_loadFiles($_SESSION['kfm']['cwd_id']);
}
function _getFileAsArray($filename){
	return explode("\n",rtrim(file_get_contents($filename)));
}
function _getFileDetails($filename){
	global $db;
	if(!file_exists($_SESSION['kfm']['currentdir'].'/'.$filename))return;
	$mimetype=mime_content_type($_SESSION['kfm']['currentdir'].'/'.$filename);
	$details=array(
		'filename'=>$filename,
		'mimetype'=>$mimetype,
		'filesize'=>kfm_resize_bytes(filesize(addslashes($_SESSION['kfm']['currentdir'].'/'.$filename)))
	);
	switch(preg_replace('/\/.*/','',$mimetype)){
		case 'image':{
			$details['caption']=kfm_getCaption($_SESSION['kfm']['currentdirpart'],$filename);
			break;
		}
	}
	return $details;
}
function _getTextFile($filename){
	if(!kfm_checkAddr($filename))return;
	if(in_array(substr($filename,strrpos($filename,'.')+1),$GLOBALS['kfm_editable_extensions'])){
		if(!is_writable($_SESSION['kfm']['currentdir'].'/'.$filename))return 'error: "'.$filename.'" is not writable'; # TODO: new string
		return array(file_get_contents($_SESSION['kfm']['currentdir'].'/'.$filename),$filename);
	}
	return 'error: "'.$filename.'" cannot be edited (restricted)'; # TODO: new string
}
function _loadFiles($rootid=1){
	global $db;
	$q=$db->prepare('select * from directories where id='.$rootid.'');
	$q->execute();
	$dirdata=$q->fetch();
	$reqdir=count($dirdata)?$dirdata['physical_address'].'/':$GLOBALS['rootdir'];
	$root=str_replace($GLOBALS['rootdir'],'',$reqdir);
	if(!kfm_checkAddr($root))return;
	$reqdir=$GLOBALS['rootdir'].$root;
	
	if(!is_dir($reqdir)){
		if(is_writable($reqdir)){
			mkdir($reqdir,0755); // TODO check if writable 
		}else{
			return 'error: directory is not writable';
		}
	}
	if($handle=opendir($reqdir)){
		$q=$db->prepare('select * from files where directory="'.$rootid.'"');
		$q->execute();
		$filesdb=$q->fetchAll();
		$fileshash=array();
		if(is_array($filesdb))foreach($filesdb as $r)$fileshash[$r['name']]=$r['id'];
		$files=array();
		while(false!==($filename=readdir($handle)))if(is_file($reqdir.'/'.$filename)){
			if(in_array(strtolower($filename), $GLOBALS['kfm_banned_files'])) continue;
			if(!isset($fileshash[$filename])){
				kfm_add_file_to_db($filename,$rootid);
				$fileshash[$filename]=$db->lastInsertId();
#return 'error: file not found in db';
			}
			$files[]=array('name'=>$filename,'parent'=>$rootid,'id'=>$fileshash[$filename]);
		}
		closedir($handle);
		$_SESSION['kfm']=array('currentdir'=>$reqdir,'currentdirpart'=>$root,'cwd_id'=>$rootid);
		return array('reqdir'=>$root,'files'=>$files,'uploads_allowed'=>$GLOBALS['kfm_allow_file_uploads']);
	}
	return 'couldn\'t read directory';
}
function _renameFile($filename,$newfilename){
	if(!kfm_checkAddr($filename)||!kfm_checkAddr($newfilename))return 'error: cannot rename "'.$filename.'" to "'.$newfilename.'"';
	$newfile=$_SESSION['kfm']['currentdir'].'/'.$newfilename;
	if(file_exists($newfile))return 'error: a file of that name already exists';
	rename($_SESSION['kfm']['currentdir'].'/'.$filename,$newfile);
	return kfm_loadFiles($_SESSION['kfm']['cwd_id']);
}
function _resize_bytes($size){
   $count = 0;
   $format = array("B","KB","MB","GB","TB","PB","EB","ZB","YB");
   while(($size/1024)>1 && $count<8)
   {
       $size=$size/1024;
       $count++;
   }
   $return = number_format($size,0,'','.')." ".$format[$count];
   return $return;
}
function _rm($id,$no_dir=0){
	if(is_array($id)){
		foreach($id as $f)kfm_rm($f,1);
	}
	else{
		global $db;
		$rf=$db->prepare('select files.name as name,physical_address FROM files,directories WHERE files.id="'.$id.'" and directories.id=files.directory');
		$rf->execute();
		$file_data=$rf->fetch();
		if(count($file_data)){
			$file_address=$file_data['physical_address'].'/'.$file_data['name'];
			unlink($file_address);
			if(file_exists($file_address))return 'error: "'.$file_data['name'].'" cannot be deleted'; # TODO: new string
			$db->exec('delete from files where id="'.$id.'"');
		}
		else return 'error: file #'.$id.' is missing from the database'; #TODO: new string
	}
	return $no_dir?0:kfm_loadFiles($_SESSION['kfm']['cwd_id']);
}
function _saveTextFile($filename,$text){
	if(kfm_checkAddr($filename))file_put_contents($_SESSION['kfm']['currentdir'].'/'.$filename,$text);
	return kfm_loadFiles($_SESSION['kfm']['cwd_id']);
}
function _search($keywords){
	global $db;
	$q=$db->prepare('select id,name,directory from files where name like "%'.addslashes($keywords).'%" order by name');
	$q->execute();
	$files=$q->fetchAll();
	return array('reqdir'=>'','files'=>$files,'uploads_allowed'=>0);
}
function _viewTextFile($fileid){
	global $db, $kfm_viewable_extensions, $kfm_highlight_extensions;
	$rf=$db->prepare('select * FROM files WHERE id="'.$fileid.'"');
	$rf->execute();
	$aFile=$rf->fetch();
	if(!count($aFile))return 'error: file not found'; # TODO better error
	$ext = strtolower(substr(strrchr($aFile['name'],'.'),1));
	if(in_array($ext, $kfm_viewable_extensions)){
		$rd=$db->prepare('SELECT * FROM directories WHERE id="'.$aFile['directory'].'"');
		$rd->execute();
		$aDirectory=$rd->fetch();
		if(!count($aDirectory))return 'error: directory not found'; # TODO better error
		$file_path=str_replace('//','/',$aDirectory['physical_address'].'/'.$aFile['name']);
		$code=file_get_contents($file_path);
		if(array_key_exists($ext,$kfm_highlight_extensions)){
			require_once('Text/Highlighter.php');
			require_once('Text/Highlighter/Renderer/Html.php');
			$renderer=new Text_Highlighter_Renderer_Html(array('numbers'=>HL_NUMBERS_TABLE,'tabsize'=>4));
			$hl=&Text_Highlighter::factory($kfm_highlight_extensions[$ext]);
			$hl->setRenderer($renderer);
			return $hl->highlight($code);
		}else{
			return $code;
		}
	}else{
		return "error: viewing file is not allowed";
	}
}
?>
