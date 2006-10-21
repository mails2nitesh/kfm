<?php
require 'php-api/txt-db-api.php';
class btk_database{
	var $sql;
	var $php_api = false;
	var $sqlite = false;
	var $mysql = false;
	var $last_inserted_id = false;
	var $result = false;
	var $errors = array();
	function __construct(){
		if(func_num_args()==0){
			$this->php_api();
		}elseif(func_num_args()==1 && func_get_arg(0) =='sqlite'){
			$this->sqlite();
		}else if(false){
			// mysql support
		}else{
			return false;
		}
	}
	
	function php_api(){
		global $rootdir;
		if (!file_exists(DB_DIR ."kfm_database")) {
			$db = new Database(ROOT_DATABASE);
			$db->executeQuery("CREATE DATABASE kfm_database");
		}
		if (!file_exists(DB_DIR . "kfm_database/parameters.txt")) {
			$db = new Database("kfm_database");
			$db->executeQuery("CREATE TABLE parameters (name str, value str)");
			$db->executeQuery("INSERT INTO parameters (name, value) VALUES ('version','0.5.1')");
		}
		if (!file_exists(DB_DIR . "kfm_database/directories.txt")) {
			$db = new Database("kfm_database");
			$db->executeQuery("CREATE TABLE directories (id inc, name str, physical_address str, parent str)");
			$db->executeQuery("INSERT INTO directories VALUES (1,'','".rtrim(addslashes($rootdir),' /')."','0')");
		}
		if (!file_exists(DB_DIR . "kfm_database/files.txt")) {
			$db = new Database("kfm_database");
			$db->executeQuery("CREATE TABLE files (id inc, name str, caption str, directory str)");
		}
		$this->php_api = true;
	}
	function sqlite(){
		global $db_create, $rootdir;
		$this->sqlite = true;
		if ($this->db =@sqlite_open(WORKPATH.DBNAME, 0666, $sqliteerror)) {
			$db_defined = 1;
			if($db_create){
				$db =&$this;
				include 'scripts/db.create.php';
			}
		} else {
   			die($sqliteerror);
		}
	}
	function prepare($sql){
		$this->sql = $sql;
		return $this;
	}
	function execute(){
		$this->query($this->sql);
	}
	function exec($sql){
		return $this->query($sql);	
	}
	function query($sql){
		if($this->php_api){
			$is_select = (strtoupper(substr($sql,0,6))=='INSERT');
			$db= new Database('kfm_database');
			$this->result = $db->executeQuery($sql);
			if($is_select) $this->last_inserted_id = $db->getLastInsertId ();
			return $this;
		}else if($this->sqlite){
			$this->result =@sqlite_query($this->db,$sql, SQLITE_ASSOC, $error_msg);
			if($this->result === false) $this->error($error_msg);
			if($this->result===false) die(sqlite_last_error($this->db));
			$this->last_inserted_id = sqlite_last_insert_rowid($this->db);
			return $this;
		}else{
			return false;
		}
	}
	function lastInsertId(){
		return $this->last_inserted_id;
	}
	function fetchAll(){	
		if($this->php_api){
			$data = array();
			$data_row = array();
			$colnames = $this->result->getColumnNames();
			while($this->result->next()){
				foreach($colnames as $col)$data_row[$col] = $this->result->getCurrentValueByName($col);
				$data[] = $data_row;
			}
			return $data;
		}else if($this->sqlite){
			return sqlite_fetch_all($this->result);
		}else{
			return false;
		}
	}
	function fetch(){
		if($this->php_api){
			$result_data = $this->fetchAll();
			if(count($result_data)){
				return $result_data[0];
			}else{
				return array();
			}
		}else if($this->sqlite){
			return sqlite_fetch_array($this->result, SQLITE_ASSOC);
		}else{
			return array();
		}
	}
	function error($msg){
		$this->errors[]=$msg;
	}
	
	function error_info(){
		// TODO create this function.
		//until then....
		return $this->errors;
	}
}

// 	$db = new btk_database();
// 	$q=$db->prepare('select id,name,directory from files where name like "%tgz%" order by name');
// 	$q->execute();
// 	$files=$q->fetchAll();
// 	return print_r($files);

?>