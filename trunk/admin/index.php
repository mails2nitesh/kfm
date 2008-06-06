<?php
require_once('../initialise.php');
?>
<html>
<head>
<title>KFM admin</title>

<link rel="stylesheet" href="../j/jquery/tabs/ui.tabs.css" type="text/css">
<link rel="stylesheet" href="../themes/<?php echo $kfm->setting('theme');?>/css.php" type="text/css">

<script type="text/javascript" src="../j/jquery/all.php"></script>
<script type="text/javascript" src="../j/jquery/tabs/ui.tabs.js"></script>
<script type="text/javascript">
$(function(){
	$('#tabscontainer > ul').tabs();
});
function message(msg){
	jobj=$('#messages');
	jobj.html(msg);
	jobj.fadeIn();
	jobj.animate({fontSize:"16px"},2500);
	jobj.fadeOut();
}
function error(msg){
	message('Error: '+msg);
}

</script>
<?php
foreach($kfm->admin_tabs as $tab){
	if($tab['stylesheet'])echo '<link rel="stylesheet" href="'.$tab['stylesheet'].'" type="text/css" />'."\n";
}
?>
<style type="text/css">
#messages{
	display:none;
	position:absolute;
	border:2px dashed #aaa;
	background-color:#006;
	color:white;
	width:200px;
	top:30px;
	right:30px;
	padding:5px;
	font-size:16px;
}
#password_div{
	margin:30px auto;
	padding:10px;
	width:350px;
	border:2px dashed #aaa;
}
#password_div label { position: absolute; text-align:left; width:130px; }
#password_div input, textarea { margin-left: 140px; }

#settings_container{
	margin-left:60px;
	margin-right:60px;
	background-color:#eee;
}
.button{
	cursor:hand;
	width:automatic;
}
#kfm_admin_users_table{
	margin-left:60px;
	margin-right:60px;
	background-color:#eee;
}
.group_header{
	font-size:24px;
	font-weight:bold;
}
.user_setting{
}
.default_setting{
	color:#777;
}
</style>
<style type="text/css">
#associations_container{
	margin-left:60px;
	margin-right:60px;
	padding:10px;
	background-color:#eee;
}
</style>
<style type="text/css">
.help_container{
	position:absolute;
	display:none;
	border:2px solid #bbb;
	background-color:#444;
	width:300px;
	padding:5px;
}
.help_title{
	margin:0 25px 0 0;
	background-color:#777;
	color:white;
}
.help_title h1{
	font-sze:10px;
	cursor:pointer;
	background-color:inherit;
}
.help_body{
	padding:10px;
	background-color:#777;
	color:white;
	margin-top:5px;
}
.help_body pre{
	display:block;
	margin: 3px 0px 3px 15px;
	padding: 2px 4px;
	font-family: verdana;
	background-color:#888;
}
.help_close{
	position:absolute;
	right:5;
	top:5;
	border:1px solid #bbb;
	background-color:#777;
	color:white;
	padding: 0 2px;
	cursor:pointer;
}
</style>
</head>
<body>
<div id="messages"></div>
<div id="tabscontainer">
	<ul>
		<?php if($kfm->user_status==1) echo '<li><a href="users.php" title="Users tab"><span>Users</span></a></li>'; ?>
		<li><a href="settings.php" title="Settings tab"><span>Settings</span></a></li>
		<li><a href="password.php" title="Password tab"><span>Change password</span></a></li>
		<?php 
		if($kfm->user_status==1) echo '<li><a href="associations.php" title="File associations"><span>File associations</span></a></li>';
		foreach($kfm->admin_tabs as $tab){
			echo '<li><a href="'.$tab['page'].'" title="'.$tab['title'].'"><span>'.$tab['title'].'</span></a></li>'."\n";
		}
		?>
	</ul>
</div>
<button onclick="message('test')">Test</button>
</body>
</html>

