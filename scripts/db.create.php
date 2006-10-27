<?php
	if($db_defined){
		chmod(WORKPATH.DBNAME,0660);
		$db->exec('create table parameters(name text, value text)');
		$db->exec('create table directories(
			id INTEGER PRIMARY KEY,
			name text,
			physical_address text,
			parent integer not null
		)');
		$db->exec('create table files(
			id INTEGER PRIMARY KEY,
			name text,
			directory integer not null,
			foreign key (directory) references directories(id)
		)');
		$db->exec('create table image_captions(
			id INTEGER PRIMARY KEY,
			caption text,
			file_id integer not null,
			foreign key (file_id) references files (id)
		)');

		$db->exec('insert into parameters values("version","0.5.1")');
		$db->exec('insert into directories values(1,"","'.rtrim(addslashes($rootdir),' /').'",0)');
	}
?>
