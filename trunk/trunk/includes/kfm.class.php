<?php
/**
 * Base kfm class
 */
class kfmBase extends kfmObject{
	var $config=array();

	/**
	 * config function, returns a configuration parameter if one config is given, 
	 * sets a config parameter if two parameters are given
	 * @param $config
	 * @param $value optional
	 * 
	 * @return $value
	 */
	function config($config,$value='novaluegiven'){
		
	}

	/**
	 * returns a parameter, returns the default if not present
	 * @param $parameter
	 * @param $default
	 * @return $value || $default if not present
	 */
	function getParameter($parameter, $default=false){

	}

	/**
	 * sets a parameter
	 * @param $parameter parameter name
	 * @param $value parameter value
	 * @return true on success || false on error
	 */
	function setParameter($parameter, $value){

	}
}
$kfm=new kfmBase();
