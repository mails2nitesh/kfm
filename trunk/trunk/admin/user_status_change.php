<?php
require_once('../initialise.php');
if($kfm->user_status!=1)die ('error("No authorization aquired")');
if(!isset($_POST['uid']) || !isset($_POST['status'])) die ('error("Some parameters are missing")');
$kfm->db->query('UPDATE '.KFM_DB_PREFIX.'users SET status='.$_POST['status'].' WHERE id='.$_POST['uid']);
?>
message('Status changed');
