<?php
if(!isset($kfm_parameters['version_db']))$kfm_parameters['version_db']=0;
$dbv=$kfm_parameters['version_db'];
if($dbv==0)$kfmdb->query("insert into ".KFM_DB_PREFIX."parameters (name,value) values ('version_db','1')");

echo '<p>Database updated. Please reload page.</p>';
exit;
