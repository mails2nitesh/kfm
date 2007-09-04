<?php
function _add_file_to_db($filename,$directory_id){
	global $kfmdb,$kfm_db_prefix;
	$sql="INSERT INTO ".$kfm_db_prefix."files (name,directory) VALUES ('".addslashes($filename)."',".$directory_id.")";
	$q=$kfmdb->query($sql);
	return $kfmdb->lastInsertId($kfm_db_prefix.'files','id');
}
function _copyFiles($files,$dir_id){
	if(!$GLOBALS['kfm_allow_file_create'])return 'error: '.kfm_lang('permissionDeniedCreateFile');
	global $kfmdb,$kfm_db_prefix;
	$to=kfm_getDirectoryParents($dir_id);
	$copied=0;
	if(!kfm_checkAddr($to))return 'error: '.kfm_lang('illegalTargetDirectory',$to);
	foreach($files as $fid){
		$oldFile=File::getInstance($fid);
		if(!$oldFile)return 'error: '.kfm_lang('noDataForFileID',$fid);
		$filename=$oldFile->name;
		if(!kfm_checkAddr($oldFile->path))return;
		copy($oldFile->path,$to.'/'.$filename);
		$id=kfm_add_file_to_db($filename,$dir_id);
		if($oldFile->isImage()){
			$oldFile=new Image($fid);
			$newFile=new Image($id);
			$newFile->setCaption($oldFile->caption);
		}
		else $newFile=File::getInstance($id);
		$newFile->setTags($oldFile->getTags());
		++$copied;
	}
	return kfm_lang('filesCopied',$copied);
}
function _createEmptyFile($cwd,$filename){
	global $kfm_session;
	$dir=new kfmDirectory($cwd);
	$path=$dir->path;
	if(!kfm_checkAddr($path.$filename))return 'error: '.kfm_lang('illegalFileName',$filename);
	return(touch($path.$filename))?kfm_loadFiles($cwd):'error: '.kfm_lang('couldNotCreateFile',$filename);
}
function _downloadFileFromUrl($url,$filename){
	global $kfm_session;
	$cwd_id=$kfm_session->get('cwd_id');
	$dir=new kfmDirectory($cwd_id);
	$cwd=$dir->getPath();
	if(!kfm_checkAddr($cwd.'/'.$filename))return 'error: filename not allowed';
	if(substr($url,0,4)!='http')return 'error: url must begin with http';
	$file=file_get_contents(str_replace(' ','%20',$url));
	if(!$file)return 'error: could not download file "'.$url.'"';
	return(file_put_contents($cwd.'/'.$filename,$file))?kfm_loadFiles($cwd_id):'error: could not write file "'.$filename.'"';
}
function _extractZippedFile($id){
	global $kfm_session;
	$cwd_id=$kfm_session->get('cwd_id');
	if(!$GLOBALS['kfm_allow_file_create'])return 'error: '.kfm_lang('permissionDeniedCreateFile');
	$file=File::getInstance($id);
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
	$file=File::getInstance($fid);
	if(!file_exists($file->path))return;
	$details=array(
		'id'=>$fid,
		'filename'=>$file->name,
		'mimetype'=>$file->mimetype,
		'filesize'=>$file->size2str(),
		'tags'=>$file->getTags(),
		'ctime'=>$file->ctime
	);
	if($file->isImage()){
		$im=new Image($file);
		$details['caption']=$im->caption;
	}
	return $details;
}
function _getFileUrl($fid,$x=0,$y=0){
	$file=File::getInstance($fid);
	return $file->getUrl($x,$y);
}
function _getTagName($id){
	global $kfmdb,$kfm_db_prefix;
	$r=db_fetch_row("select name from ".$kfm_db_prefix."tags where id=".$id);
	if(count($r))return array($id,$r['name']);
	return array($id,'UNKNOWN TAG '.$id);
}
function _getTextFile($fid){
	$file=File::getInstance($fid);
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
	return array('content'=>utf8_encode($file->getContent()),'name'=>$file->name,'id'=>$file->id, 'language'=>$language);
}
function _loadFiles($rootid=1){
	global $kfm_session;
	$dir=kfmDirectory::getInstance($rootid);
	$oFiles=$dir->getFiles();
	if($dir->hasErrors())return $dir->getErrors();
	$files=array();
	foreach($oFiles as $file){
		$aFile=array('id'=>$file->id,'ctime'=>$file->ctime,'name'=>$file->name,'writable'=>$file->writable);
		if($file->isImage()){
			$aFile['width']=$file->width;
			$aFile['height']=$file->height;
			$aFile['thumb_url']=$file->thumb_url;
		}
		$files[]=$aFile;
	}
	$root='/'.str_replace($GLOBALS['rootdir'],'',$dir->path);
	$kfm_session->set('cwd_id',$rootid);
	return array('reqdir'=>$root,'files'=>$files,'uploads_allowed'=>$GLOBALS['kfm_allow_file_upload'], 'get_params'=>GET_PARAMS); 
}
function _moveFiles($files,$dir_id){
	global $kfmdb,$kfm_db_prefix,$kfm_session;
	$cwd_id=$kfm_session->get('cwd_id');
	if(!$GLOBALS['kfm_allow_file_move'])return 'error: '.kfm_lang('permissionsDeniedMoveFile');
	$dirdata=kfm_getDirectoryDbInfo($dir_id);
	if(!$dirdata)return 'error: '.kfm_lang('noDataForDirectoryID',$dir_id);
	$to=kfm_getDirectoryParents($dir_id);
	if(!kfm_checkAddr($to))return 'error: '.kfm_lang('illegalTargetDirectory',$to);
	foreach($files as $fid){
		$filedata=db_fetch_row("select directory,name from ".$kfm_db_prefix."files where id=".$fid);
		if(!$filedata)return 'error: '.kfm_lang('noDataForFileID',$file);
		$dir=kfm_getDirectoryParents($filedata['directory']);
		$file=$filedata['name'];
		if(!kfm_checkAddr($dir.'/'.$file))return;
		rename($dir.'/'.$file,$to.'/'.$file);
		$q=$kfmdb->query("update ".$kfm_db_prefix."files set directory=".$dir_id." where id=".$fid);
	}
	return kfm_loadFiles($cwd_id);
}
function _renameFile($fid,$newfilename,$refreshFiles=true){
	if(!$GLOBALS['kfm_allow_file_edit'])return 'error: '.kfm_lang('permissionDeniedEditFile');
	global $kfmdb,$kfm_db_prefix,$kfm_session;
	$cwd_id=$kfm_session->get('cwd_id');
	$file=File::getInstance($fid);
	if(!file_exists($file->path))return;
	$filename=$file->name;
	if(!kfm_checkAddr($filename)||!kfm_checkAddr($newfilename))return 'error: '.kfm_lang('cannotRenameFromTo',$filename,$newfilename);
	$newfile=$file->directory.'/'.$newfilename;
	if(file_exists($newfile))return 'error: '.kfm_lang('fileAlreadyExists');
	rename($file->path,$newfile);
	$kfmdb->query("update ".$kfm_db_prefix."files set name='".addslashes($newfilename)."' where id=".$fid);
	if($refreshFiles)return kfm_loadFiles($cwd_id);
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
		$file=File::getInstance($id);
		if($file->isImage())$file=new Image($file->id);
		$ret=$file->delete();
		if(!$ret)return $file->getErrors();
	}
	if(!$dontLoadFiles)return $id;
}
function _saveTextFile($fid,$text){
	if(!$GLOBALS['kfm_allow_file_edit'])return 'error: '.kfm_lang('permissionDeniedEditFile');
	$f=File::getInstance($fid);
	$f->setContent($text);
	return $f->hasErrors()?$f->getErrors():'file saved';
}
function _search($keywords,$tags){
	global $kfmdb,$kfm_db_prefix;
	$valid_files=array();
	if($tags){
		$arr=explode(',',$tags);
		foreach($arr as $tag){
			$tag=ltrim(rtrim($tag));
			if($tag){
				$r=db_fetch_row("select id from ".$kfm_db_prefix."tags where name='".addslashes($tag)."'");
				if(count($r)){
					if(count($valid_files))$constraints=' and (file_id='.join(' or file_id=',$valid_files).')';
					$rs2=db_fetch_all("select file_id from ".$kfm_db_prefix."tagged_files where tag_id=".$r['id'].$constraints);
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
		$fs=db_fetch_all("select id from ".$kfm_db_prefix."files where name like '%".addslashes($keywords)."%'".$constraints." order by name");
		foreach($fs as $f){
			$file=File::getInstance($f['id']);
			if($file->isImage())$file=new Image($f['id']);
			unset($file->db);
			unset($file->db);
			$files[]=$file;
		}
	}
	return array('reqdir'=>kfm_lang('searchResults'),'files'=>$files,'uploads_allowed'=>0);
}
function _tagAdd($recipients,$tagList){
	if(!$GLOBALS['kfm_allow_file_edit'])return 'error: '.kfm_lang('permissionDeniedEditFile');
	global $kfmdb,$kfm_db_prefix;
	if(!is_array($recipients))$recipients=array($recipients);
	$arr=explode(',',$tagList);
	$tagList=array();
	foreach($arr as $v){
		$v=ltrim(rtrim($v));
		if($v)$tagList[]=$v;
	}
	if(count($tagList))foreach($tagList as $tag){
		$r=db_fetch_row("select id from ".$kfm_db_prefix."tags where name='".addslashes($tag)."'");
		if(count($r)){
			$tag_id=$r['id'];
			$kfmdb->query("delete from ".$kfm_db_prefix."tagged_files where tag_id=".$tag_id." and (file_id=".join(' or file_id=',$recipients).")");
		}
		else{
			$q=$kfmdb->query("insert into ".$kfm_db_prefix."tags (name) values('".addslashes($tag)."')");
			$tag_id=$kfmdb->lastInsertId($kfm_db_prefix.'tags','id');
		}
		foreach($recipients as $file_id)$kfmdb->query("insert into ".$kfm_db_prefix."tagged_files (tag_id,file_id) values(".$tag_id.",".$file_id.")");
	}
	return _getFileDetails($recipients[0]);
}
function _tagRemove($recipients,$tagList){
	if(!$GLOBALS['kfm_allow_file_edit'])return 'error: '.kfm_lang('permissionDeniedEditFile');
	global $kfmdb,$kfm_db_prefix;
	if(!is_array($recipients))$recipients=array($recipients);
	$arr=explode(',',$tagList);
	$tagList=array();
	foreach($arr as $tag){
		$tag=ltrim(rtrim($tag));
		if($tag){
			$r=db_fetch_row("select id from ".$kfm_db_prefix."tags where name='".addslashes($tag)."'");
			if(count($r))$tagList[]=$r['id'];
		}
	}
	if(count($tagList))$kfmdb->exec("delete from ".$kfm_db_prefix."tagged_files where (file_id=".join(' or file_id=',$recipients).") and (tag_id=".join(' or tag_id="',$tagList).")");
	return _getFileDetails($recipients[0]);
}
function _viewTextFile($fileid){
	global $kfm_viewable_extensions, $kfm_highlight_extensions, $kfm_editable_extensions;
	$file=File::getInstance($fileid);
	$ext=$file->getExtension();
	$buttons_to_show=1; # boolean addition: 1=Close, 2=Edit
	if(in_array($ext,$kfm_editable_extensions)&&$file->isWritable())$buttons_to_show+=2;
	if(in_array($ext,$kfm_viewable_extensions)){
		$code=file_get_contents($file->path);
		if(array_key_exists($ext,$kfm_highlight_extensions)){
			require_once('Text/Highlighter.php');
			require_once('Text/Highlighter/Renderer/Html.php');
			$renderer=new Text_Highlighter_Renderer_Html(array('numbers'=>HL_NUMBERS_TABLE,'tabsize'=>4));
			$hl=&Text_Highlighter::factory($kfm_highlight_extensions[$ext]);
			$hl->setRenderer($renderer);
			$code=$hl->highlight($code);
		}else if($ext=='txt'){
			$code=nl2br($code);
		}
		return array('id'=>$fileid,'content'=>$code,'buttons_to_show'=>$buttons_to_show,'name'=>$file->name);
	}
	return 'error: '.kfm_lang('permissionDeniedViewFile');
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
		$file=File::getInstance($f);
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
