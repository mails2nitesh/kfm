<?php
# see ../license.txt for licensing

function kfm_api_createDirectory($parent,$name){
	$r=kfm_createDirectory($parent,$name);
	foreach($r['directories'] as $dir)if($dir[0]==$name)return $dir[2];
	return 0;
}
function kfm_api_getDirectoryId($address){
	global $kfmdb,$kfm_db_prefix,$rootdir,$kfm_db_type;
	if($kfm_db_type=='mysql')$add="concat(physical_address,'/')";
	else $add="physical_address||'/'";
	$q=$kfmdb->query("select id from ".$kfm_db_prefix."directories where physical_address='".$rootdir.addslashes($address)."' or ".$add."='".$rootdir.addslashes($address)."'");
	$r=$q->fetchRow();
	return count($r)?$r['id']:0;
}
function kfm_api_removeFile($id){
	$f=new File($id);
	$p=$f->parent;
	$f->delete();
	return kfm_loadFiles($p);
}
$kfm_api_auth_override=1;

?>
