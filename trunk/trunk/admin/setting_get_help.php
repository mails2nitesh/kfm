<?php
require_once('../initialise.php');
$sn=$_POST['name'];
$a=db_fetch_all('SELECT help FROM settings_help WHERE name="'.$sn.'"');
if(count($a)){
	$help=$a[0]['help'];
}else{
	//$kfm->db->query('INSERT INTO settings_help (name, help) VALUES ("'.$sn.'","'.$sn.' help")');
	$help='There is no help available for the setting '.$sn;
}
echo $help;
?>
