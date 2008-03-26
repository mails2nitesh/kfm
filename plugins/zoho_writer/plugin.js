function plugin_zoho_writer(){
	this.name='zoho_writer';
	this.title='View with zoho';
	this.category='view';
	this.defaultOpener=1;
	this.mode=0; //only one file
	this.writable=2;
	this.extensions=['doc','rtf','odt','swx','html','txt'];
	this.doFunction=function(files){
		fid=files[0];
		kfm_pluginIframeShow('plugins/zoho_writer/viewer.php?id='+fid);
	}
}
kfm_addHook(new plugin_zoho_writer());
