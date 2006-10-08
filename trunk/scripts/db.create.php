<?
	try{
		$db=new PDO('sqlite:'.$rootdir.'.files/db');
		$db_defined=1;
	}
	catch(PDOException $e){
		$db_defined=0;
	}

	if($db_defined){
		chmod($rootdir.'.files/db',0660);
		$db->exec('create table parameters(name text, value text)');
		$db->exec('create table directories(
			id int not null primary key,
			name text,
			physical_address text,
			parent int not null
		)');
		$db->exec('create table files(
			id int not null primary key,
			name text,directory int not null
		)');

		$db->exec('insert into parameters values("version","0.5.1")');
		$db->exec('insert into directories values(1,"","'.addslashes($rootdir).'",0)');
	}
?>
