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
			id integer not null,
			name text,
			physical_address text,
			parent integer not null,
			primary key (id)
		)');
		$db->exec('create table files(
			id integer not null,
			name text,
			directory integer not null,
			primary key (id),
			foreign key (directory) references directories(id)
		)');
		$db->exec('create table image_captions(
			id integer not null,
			caption text,
			file_id integer not null,
			primary key (id),
			foreign key (file_id) references files (id)
		)');

		$db->exec('insert into parameters values("version","0.5.1")');
		$db->exec('insert into directories values(1,"","'.rtrim(addslashes($rootdir),' /').'",0)');
	}
?>
