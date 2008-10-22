function plugin_return_url(){
	this.name='return_url';
	this.title='return url';
	this.mode=2;
	this.writable=2;
	this.category='returning';
	this.extensions='all';
	this.doFunction=function(files){
		if(!window.opener){
			kfm.alert(_("There is no KFM opener to return to",0,0,0));
			return;
		}
		x_kfm_getFileUrls(selectedFiles,function(urls){
			if(files.length==1&&File_getInstance(files[0]).width)window.opener.SetUrl(urls[0].replace(/([^:]\/)\//g,'$1'),0,0,File_getInstance(files[0]).caption);
			else{
				if(files.length==1)window.opener.SetUrl(urls[0]);
				else window.opener.SetUrl('"'+urls.join('","')+'"');
			}
			setTimeout('window.close()',1);
		});
	}
	this.nocontextmenu=false; // Set this to true and make sure that file associations all points to this plugin for old style behaviour
}
kfm_addHook(new plugin_return_url());
