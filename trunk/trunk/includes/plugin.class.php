<?php
/**
 * KFM plugin class
 */
class kfmPlugin extends kfmObject{
	public $disabled=false;
	public $name='KFM plugin';
	public $title='KFM plugin';
	public $settings=array();
	private $javascript='';
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
		$js='';
		if(strlen($this->javascript))$js.=kfm_parse_template($this->javascript);
		if(file_exists($this->path.'plugin.js'))$js.=file_get_contents($this->path.'plugin.js');
		return $js;
	}
	function addJavascript($js){
		$this->javascript.=$js."\n";
	}
}
