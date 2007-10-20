<?php
function _add_file_to_db($filename,$directory_id){
	global $kfmdb;
	$sql="INSERT INTO ".KFM_DB_PREFIX."files (name,directory) VALUES ('".addslashes($filename)."',".$directory_id.")";
	$q=$kfmdb->query($sql);
	return $kfmdb->lastInsertId(KFM_DB_PREFIX.'files','id');
}
function _copyFiles($files,$dir_id){
	if(!$GLOBALS['kfm_allow_file_create'])return 'error: '.kfm_lang('permissionDeniedCreateFile');
	global $kfmdb;
	$to=kfm_getDirectoryParents($dir_id);
	if(!is_writable($to)) return 'error: Directory is not writable'; //TODO new string
	$copied=0;
	if(!kfm_checkAddr($to))return 'error: '.kfm_lang('illegalTargetDirectory',$to);
	foreach($files as $fid){
		$oldFile=kfmFile::getInstance($fid);
		if(!$oldFile)return 'error: '.kfm_lang('noDataForFileID',$fid);
		$filename=$oldFile->name;
		if(!kfm_checkAddr($oldFile->path))return;
		copy($oldFile->path,$to.'/'.$filename);
		$id=kfm_add_file_to_db($filename,$dir_id);
		if($oldFile->isImage()){
			$oldFile=kfmImage::getInstance($fid);
			$newFile=kfmImage::getInstance($id);
			$newFile->setCaption($oldFile->caption);
		}
		else $newFile=kfmFile::getInstance($id);
		$newFile->setTags($oldFile->getTags());
		++$copied;
	}
	kfm_addMessage(kfm_lang('filesCopied',$copied));
}
function _createEmptyFile($cwd,$filename){
	global $kfm_session;
	$dir=kfmDirectory::getInstance($cwd);
	$path=$dir->path;
	if(!kfm_checkAddr($path.$filename))return 'error: '.kfm_lang('illegalFileName',$filename);
	return(touch($path.$filename))?kfm_loadFiles($cwd):'error: '.kfm_lang('couldNotCreateFile',$filename);
}
function _downloadFileFromUrl($url,$filename){
	global $kfm_session,$kfm_default_upload_permission;
	$cwd_id=$kfm_session->get('cwd_id');
	$dir=kfmDirectory::getInstance($cwd_id);
	$cwd=$dir->getPath();
	if(!kfm_checkAddr($cwd.'/'.$filename))return 'error: filename not allowed';
	if(substr($url,0,4)!='http')return 'error: url must begin with http';
	$file=file_get_contents(str_replace(' ','%20',$url));
	if(!$file)return 'error: could not download file "'.$url.'"';
	if(!file_put_contents($cwd.'/'.$filename,$file))return 'error: could not write file "'.$filename.'"'; # TODO: new string
	chmod($to, octdec('0'.$kfm_default_upload_permission));
	return kfm_loadFiles($cwd_id);
}
function _extractZippedFile($id){
	global $kfm_session;
	$cwd_id=$kfm_session->get('cwd_id');
	if(!$GLOBALS['kfm_allow_file_create'])return 'error: '.kfm_lang('permissionDeniedCreateFile');
	$file=kfmFile::getInstance($id);
	$dir=$file->directory.'/';
	{ # try native system unzip command
		$res=-1;
		$arr=array();
		exec('unzip -l "'.$dir.$file->name.'"',$arr,$res);
		if(!$res){
			for($i=3;$i<count($arr)-2;++$i){
				$filename=preg_replace('/.* /','',$arr[$i]);
				if(!kfm_checkAddr($filename))return 'error: zip contains a banned filename';
			}
			exec('unzip -o "'.$dir.$file->name.'" -x -d "'.$dir.'"',$arr,$res);
		}
	}
	if($res){ # try PHP unzip command
		return 'error: unzip failed';
		$zip=zip_open($dir.$file->name);
		while($zip_entry=zip_read($zip)){
			$entry=zip_entry_open($zip,$zip_entry);
			$filename=zip_entry_name($zip_entry);
			$target_dir=$dir.substr($filename,0,strrpos($filename,'/'));
			$filesize=zip_entry_filesize($zip_entry);
			if(is_dir($target_dir)||mkdir($target_dir)){
				if($filesize>0){
					$contents=zip_entry_read($zip_entry,$filesize);
					file_put_contents($dir.$filename,$contents);
				}
			}
		}
	}
	return kfm_loadFiles($cwd_id);
}
function _getFileAsArray($filename){
	return explode("\n",rtrim(file_get_contents($filename)));
}
function _getFileDetails($fid){
	$file=kfmFile::getInstance($fid);
	if(!is_object($file))return 'error: failed to retrieve File object'; # TODO: New String
	$fpath=$file->path;
	if(!file_exists($fpath))return;
	$details=array(
		'id'=>$file->id,
		'name'=>$file->name,
		'filename'=>$file->name,
		'mimetype'=>$file->mimetype,
		'filesize'=>$file->size2str(),
		'tags'=>$file->getTags(),
		'ctime'=>$file->ctime,
		'writable'=>$file->isWritable()
	);
	if($file->isImage()){
		$im=kfmImage::getInstance($file);
		$details['caption']=$im->caption;
		$details['width']=$im->width;
		$details['height']=$im->height;
		$details['thumb_url']=$im->thumb_url;
	}
	return $details;
}
function _getFileUrl($fid,$x=0,$y=0){
	$file=kfmFile::getInstance($fid);
	return $file->getUrl($x,$y);
}
function _getTagName($id){
	global $kfmdb;
	$r=db_fetch_row("select name from ".KFM_DB_PREFIX."tags where id=".$id);
	if(count($r))return array($id,$r['name']);
	return array($id,'UNKNOWN TAG '.$id);
}
function _getTextFile($fid){
	$file=kfmFile::getInstance($fid);
	if(!kfm_checkAddr($file->name))return;
	$ext=$file->getExtension();
	if(!$file->isWritable())return 'error: '.kfm_lang('isNotWritable',$file->name);
	/**
	 * determine language for Codepress
	 */
	switch($ext){
		case 'html':
		case 'tpl':
			$language='html';
			break;
		case 'php':
			$language = 'php';
			break;
		case 'css':
			$language = 'css';
			break;
		case 'js':
			$language = 'javascript';
			break;
		case 'j':
			$language = 'java';
			break;
		case 'pl':
			$language = 'perl';
			break;
		case 'ruby':
			$language = 'ruby';
			break;
		case 'sql':
			$language = 'sql';
			break;
		case 'tex':
			$language = 'tex';
			break;
		case 'txt':
			$language = 'text';
			break;
		default:
			$language = 'generic';
			break;
	}
	return array('content'=>$file->getContent(),'name'=>$file->name,'id'=>$file->id,'language'=>$language);
}
function _loadFiles($rootid=1){
	global $kfm_session;
	$dir=kfmDirectory::getInstance($rootid);
	$oFiles=$dir->getFiles();
	if($dir->hasErrors())return $dir->getErrors();
	$files=array();
	foreach($oFiles as $file)$files[]=_getFileDetails($file);
	$root='/'.str_replace($GLOBALS['rootdir'],'',$dir->path);
	$kfm_session->set('cwd_id',$rootid);
	return array('reqdir'=>$root,'files'=>$files,'uploads_allowed'=>$GLOBALS['kfm_allow_file_upload']); 
}
function _moveFiles($files,$dir_id){
	global $kfmdb,$kfm_session;
	$cwd_id=$kfm_session->get('cwd_id');
	if(!$GLOBALS['kfm_allow_file_move'])return 'error: '.kfm_lang('permissionsDeniedMoveFile');
	$dirdata=kfm_getDirectoryDbInfo($dir_id);
	if(!$dirdata)return 'error: '.kfm_lang('noDataForDirectoryID',$dir_id);
	$to=kfm_getDirectoryParents($dir_id);
	if(!is_writable($to)) return 'error: Directory is not writable'; //TODO new string
	if(!kfm_checkAddr($to))return 'error: '.kfm_lang('illegalTargetDirectory',$to);
	foreach($files as $fid){
		$filedata=db_fetch_row("select directory,name from ".KFM_DB_PREFIX."files where id=".$fid);
		if(!$filedata)return 'error: '.kfm_lang('noDataForFileID',$file);
		$dir=kfm_getDirectoryParents($filedata['directory']);
		$file=$filedata['name'];
		if(!kfm_checkAddr($dir.'/'.$file))return;
		rename($dir.'/'.$file,$to.'/'.$file);
		if(!file_exists($to.'/'.$file))return 'error: failed to move file'; # TODO: new string
		$q=$kfmdb->query("update ".KFM_DB_PREFIX."files set directory=".$dir_id." where id=".$fid);
	}
	return kfm_loadFiles($cwd_id);
}
function _renameFile($fid,$newfilename,$refreshFiles=true){
	global $kfm_session;
	$file=kfmFile::getInstance($fid);
	$file->rename($newfilename);
	if($file->hasErrors())return $file->getErrors();
	if($refreshFiles)return kfm_loadFiles($kfm_session->get('cwd_id'));
}
function _renameFiles($files,$template){
	global $kfm_session;
	$cwd_id=$kfm_session->get('cwd_id');
	if(!$GLOBALS['kfm_allow_file_edit'])return 'error: '.kfm_lang('permissionDeniedEditFile');
	$prefix=preg_replace('/\*.*/','',$template);
	$postfix=preg_replace('/.*\*/','',$template);
	$precision=strlen(preg_replace('/[^*]/','',$template));
	for($i=1;$i<count($files)+1;++$i){
		$num=str_pad($i,$precision,'0',STR_PAD_LEFT);
		$ret=_renameFile($files[$i-1],$prefix.$num.$postfix,false);
		if($ret)return $ret; # error detected
	}
	return kfm_loadFiles($cwd_id);
}
function _resize_bytes($size){
	$count=0;
	$format=array("B","KB","MB","GB","TB","PB","EB","ZB","YB");
	while(($size/1024)>1&&$count<8){
		$size=$size/1024;
		++$count;
	}
	$return=number_format($size,0,'','.')." ".$format[$count];
	return $return;
}
function _rm($id,$dontLoadFiles=false){
	if(!$GLOBALS['kfm_allow_file_delete'])return 'error: '.kfm_lang('permissionDeniedDeleteFile');
	if(is_array($id)){
		foreach($id as $f){
			$ret=_rm($f,true);
			if($ret)return $ret;
		}
	}
	else{
		$file=kfmFile::getInstance($id);
		if($file->isImage())$file=kfmImage::getInstance($file->id);
		$ret=$file->delete();
		if(!$ret)return $file->getErrors();
	}
	if(!$dontLoadFiles)return $id;
}
function _saveTextFile($fid,$text){
	if(!$GLOBALS['kfm_allow_file_edit'])return 'error: '.kfm_lang('permissionDeniedEditFile');
	$f=kfmFile::getInstance($fid);
	$f->setContent($text);
	return $f->hasErrors()?$f->getErrors():'file saved';
}
function _search($keywords,$tags){
	global $kfmdb;
	$valid_files=array();
	if($tags){
		$arr=explode(',',$tags);
		foreach($arr as $tag){
			$tag=ltrim(rtrim($tag));
			if($tag){
				$r=db_fetch_row("select id from ".KFM_DB_PREFIX."tags where name='".addslashes($tag)."'");
				if(count($r)){
					if(count($valid_files))$constraints=' and (file_id='.join(' or file_id=',$valid_files).')';
					$rs2=db_fetch_all("select file_id from ".KFM_DB_PREFIX."tagged_files where tag_id=".$r['id'].$constraints);
					if(count($rs2)){
						$valid_files=array();
						foreach($rs2 as $r2)$valid_files[]=$r2['file_id'];
					}
					else $valid_files=array(0);
				}
			}
		}
	}
	if(($tags&&count($valid_files))||$keywords){ # keywords
		$constraints='';
		if(count($valid_files))$constraints=' and (id='.join(' or id=',$valid_files).')';
		$files=array();
		$fs=db_fetch_all("select id from ".KFM_DB_PREFIX."files where name like '%".addslashes($keywords)."%'".$constraints." order by name");
		foreach($fs as $f){
			$file=kfmFile::getInstance($f['id']);
			if(!$file->checkName())continue;
			if($file->isImage())$file=kfmImage::getInstance($f['id']);
			unset($file->db);
			$files[]=$file;
		}
	}
	return array('reqdir'=>kfm_lang('searchResults'),'files'=>$files,'uploads_allowed'=>0);
}
function _tagAdd($recipients,$tagList){
	if(!$GLOBALS['kfm_allow_file_edit'])return 'error: '.kfm_lang('permissionDeniedEditFile');
	global $kfmdb;
	if(!is_array($recipients))$recipients=array($recipients);
	$arr=explode(',',$tagList);
	$tagList=array();
	foreach($arr as $v){
		$v=ltrim(rtrim($v));
		if($v)$tagList[]=$v;
	}
	if(count($tagList))foreach($tagList as $tag){
		$r=db_fetch_row("select id from ".KFM_DB_PREFIX."tags where name='".addslashes($tag)."'");
		if(count($r)){
			$tag_id=$r['id'];
			$kfmdb->query("delete from ".KFM_DB_PREFIX."tagged_files where tag_id=".$tag_id." and (file_id=".join(' or file_id=',$recipients).")");
		}
		else{
			$q=$kfmdb->query("insert into ".KFM_DB_PREFIX."tags (name) values('".addslashes($tag)."')");
			$tag_id=$kfmdb->lastInsertId(KFM_DB_PREFIX.'tags','id');
		}
		foreach($recipients as $file_id)$kfmdb->query("insert into ".KFM_DB_PREFIX."tagged_files (tag_id,file_id) values(".$tag_id.",".$file_id.")");
	}
	return _getFileDetails($recipients[0]);
}
function _tagRemove($recipients,$tagList){
	if(!$GLOBALS['kfm_allow_file_edit'])return 'error: '.kfm_lang('permissionDeniedEditFile');
	global $kfmdb;
	if(!is_array($recipients))$recipients=array($recipients);
	$arr=explode(',',$tagList);
	$tagList=array();
	foreach($arr as $tag){
		$tag=ltrim(rtrim($tag));
		if($tag){
			$r=db_fetch_row("select id from ".KFM_DB_PREFIX."tags where name='".addslashes($tag)."'");
			if(count($r))$tagList[]=$r['id'];
		}
	}
	if(count($tagList))$kfmdb->exec("delete from ".KFM_DB_PREFIX."tagged_files where (file_id=".join(' or file_id=',$recipients).") and (tag_id=".join(' or tag_id="',$tagList).")");
	return _getFileDetails($recipients[0]);
}
function _zip($filename,$files){
	global $kfm_session;
	$cwd_id=$kfm_session->get('cwd_id');
	$dir=kfmDirectory::getInstance($cwd_id);
	$cwd=$dir->path;
	if(!$GLOBALS['kfm_allow_file_create'])return 'error: '.kfm_lang('permissionDeniedCreateFile');
	global $rootdir;
	if(!kfm_checkAddr($cwd.'/'.$filename))return 'error: '.kfm_lang('illegalFileName',$filename);
	$arr=array();
	foreach($files as $f){
		$file=kfmFile::getInstance($f);
		if(!$file)return 'error: '.kfm_lang('missingFileInSelection');
		$arr[]=$file->path;
	}
	{ # try native system zip command
		$res=-1;
		$pdir=$cwd.'/';
		$zipfile=$pdir.$filename;
		for($i=0;$i<count($arr);++$i)$arr[$i]=str_replace($pdir,'',$arr[$i]);
		exec('cd "'.$cwd.'" && zip -D "'.$zipfile.'" "'.join('" "',$arr).'"',$arr,$res);
	}
	if($res)return 'error: '.kfm_lang('noNativeZipCommand');
	return kfm_loadFiles($cwd_id);
}
?>
