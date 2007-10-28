<?php
class DB_SQLite_PDO{
	var $connection=0;
	function DB($dsn=array()){
		if(!isset($dsn['database']))exit('no SQLite database set in configuration');
		try {
			$this->connection=new PDO('sqlite:'.$dsn['database']);
		} catch (PDOException $e) {
			print "Error!: " . $e->getMessage();
			die();
		}
	}
	function __construct($dsn=array()){
		$this->DB($dsn);
	}
	function fetchAll($query){
		$sth=$this->connection->prepare($query);
		if(!$sth)return false;
		$sth->execute();
		return $sth->fetchAll();
	}
	function fetchRow($query){
		$sth=$this->connection->prepare($query);
		if(!$sth)return false;
		$sth->execute();
		return $sth->fetch();
	}
	function lastInsertId($name=''){
		return $this->connection->lastInsertId($name);
	}
	function query($query){
		return $this->connection->exec($query);
	}
}
