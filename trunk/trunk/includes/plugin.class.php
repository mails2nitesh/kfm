<?php
/**
 * KFM plugin class
 */
class kfmPlugin extends kfmObject{
	public $disabled=false;
	public $name='KFM plugin';
	public $title='KFM plugin';
	public $settings=array();
	private $javascript=false;
	function __construct($name){
		$this->name=$name;
		$this->title=$this->name;
		$bt=debug_backtrace();
		$this->path=dirname($bt[0]['file']).'/';
	}

	function addSetting($name, $definition, $default){
		$this->settings[]=array('name'=>$name,'definition'=>$definition,'default'=>$default);
	}

	function getJavascript(){
		if($this->disabled)return '';
		if($this->javascript)return $this->javascript;
		if(file_exists($this->path.'plugin.js'))return file_get_contents($this->path.'plugin.js');
	}
}
