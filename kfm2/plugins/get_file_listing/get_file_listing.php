<?php
function get_file_listing(){
	$req_dir=isset($_REQUEST['d'])?$_REQUEST['d']:'';
	$d=KFM_USERDIR .'/'. $req_dir;

	if(preg_match('/\.\./',$d))die('{"error":1,"error_message":"no hacking please"}');
	if(!file_exists($d))die('{"error":2,"error_message":"directory <b>'.$d.'</b> does not exist"}');
	if(!is_dir($d))die('{"error":3,"error_message":"requested directory is not a directory"}');

	$files=array();
	$directories=array();

	foreach(new DirectoryIterator($d) as $f){
		if($f->isDot())continue;
		$fname=$f->getFilename();
		if($fname{0}=='.')continue;
		if($f->isDir()){
			$directories[$fname]=array(
				'mtime'=>$f->getMTime()
			);
			continue;
		}
		$files[$fname]=array(
			'size'=>$f->getSize(),
			'mtime'=>$f->getMTime()
		);
	}

	$ret=array(
		'd'=>$req_dir,
		'files'=>$files,
		'directories'=>$directories
	);
	header('Content-type: text/javascript; charset=utf-8');
	echo json_encode($ret);
}
