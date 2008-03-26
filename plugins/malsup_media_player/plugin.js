function plugin_jwplayer(){
	this.name='malsup_media_player';
	this.title='Play'; // TODO: string
	this.category='view';
	this.extensions=['asf','avi','flv','mov','mpg','mpeg','mp4','qt','smil','swf','wmv','aif','aac','au','gsm','mid','midi','mov','mp3','m4a','snd','rm','wav','wma'];
	this.mode=2;
	this.writable=2;//all
	this.doFunction=function(files){
		var url='plugins/malsup_media_player/player.php?ids='+files.join();
		kfm_pluginIframeShow(url);
	}
}
kfm_addHook(new plugin_jwplayer());
