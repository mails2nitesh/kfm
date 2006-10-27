<?php
class btk_database extends Object{
	var $sql;
	var $sqlite = false;
	var $mysql = false;
	var $last_inserted_id = false;
	var $result = false;
	function __construct(){

		if(func_num_args()==1 && func_get_arg(0) =='sqlite'){
			$this->sqlite();
		}else if(false){
			// mysql support
		}else{
			return false;
		}
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
		if($this->sqlite){
			$this->result =@sqlite_query($this->db,$sql, SQLITE_ASSOC, $error_msg);
			if($this->result === false) $this->error($error_msg);
			//if($this->result===false) die(sqlite_last_error($this->db));
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
		if($this->sqlite){
			return sqlite_fetch_all($this->result);
		}else{
			return false;
		}
	}
	function fetch(){
		if($this->sqlite){
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
?>
