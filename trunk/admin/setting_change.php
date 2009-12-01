<?php
require_once('initialise.php');
if(!isset($_POST['name']) || !isset($_POST['value'])) die ('error("post value missing");');
$sn=$_POST['name'];
$uid=$kfm->user_id;
$value=$_POST['value'];
if($kfm->sdef[$sn]['type']=='select_list'){
	if(!isset($_POST['checked']))die ('error("property checked must be given for a select list");');
	$ch=$_POST['checked'];
	$sval=implode(',',$kfm->setting($sn));
	if(isset($_POST['clean']) && $_POST['clean'])$sval='';
	if($ch){
		$sval.=','.$value;
	}else{
		$sval=preg_replace('/'.$value.',*/','',$sval);
	}
	$sval=trim($sval, ' ,');
	$value=$sval;
}
if($kfm->isAdmin() || $kfm->isUserSetting($sn)){
  $s=db_fetch_row('SELECT id FROM '.KFM_DB_PREFIX.'settings WHERE name="'.mysql_escape_string($sn).'" and user_id='.$uid);
  if($s && count($s)){
    $kfm->db->query('UPDATE '.KFM_DB_PREFIX.'settings SET value="'.mysql_escape_string($value).'" WHERE name="'.mysql_escape_string($sn).'" AND user_id='.$uid);
  }else{
    $kfm->db->query('INSERT INTO '.KFM_DB_PREFIX.'settings (name, value, user_id, usersetting) VALUES ("'.mysql_escape_string($sn).'","'.mysql_escape_string($value).'", '.$uid.',1)');
	  if($kfm->user_id!=1) echo '$("#todefault_'.$sn.'").fadeIn();';
  }
}
if($sn=='theme')$kfm_session->set('theme',$value);
echo 'style_usersetting("'.$sn.'");';
?>
message('setting changed');
