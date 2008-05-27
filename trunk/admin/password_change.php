<?php
require_once('../initialise.php');
if(isset($_POST['uid'])){
	if($kfm->user_status==1){
		$uid=$_POST['uid'];
	}else{
		die('error("Unauthorized attempt to change a users password");');
	}
}else{
	$uid=$kfm->user_id;
}
if(!isset($_POST['npw'])||!isset($_POST['npw2']))die('error("Error: no new passwords given.");');
if($_POST['npw']!=$_POST['npw2'])die('error("The passwords are not equal");');
$kfmdb->query('UPDATE '.KFM_DB_PREFIX.'users SET password="'.sha1($_POST['npw']).'" WHERE id='.$uid);
if($uid==$kfm->user_id)$kfm_session->set('password',$_POST['npw']);
?>
message('Password changed');
