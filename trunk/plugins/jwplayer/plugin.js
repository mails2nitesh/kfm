function plugin_jwplayer(){
	this.name='jwplayer';
	this.title='Play with JW Media player';
	this.category='view';
	this.extensions=['flv','jpg','png','gif','svg','avi','mp3'];
	this.mode=2;
	this.writable=2;//all
	this.doFunction=function(files){
		var url='plugins/jwplayer/jwplayer.php?id='+files.join();
		kfm_pluginIframeShow(url);
	}
}
kfm_addHook(new plugin_jwplayer());
