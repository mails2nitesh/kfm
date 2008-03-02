function plugin_cropper(){
	/*defaults*/
	this.name="cropper";
	this.mode=0; //single files only
	this.title="Crop";
	this.extensions=["jpg","png","gif"];
	this.category="edit";
	this.writable=0; // non writable default

	this.crop_to_new=function(fid){
		var data=File_getInstance(fid[0]);
		var url='plugins/cropper/croparea.php?id='+fid+'&width='+data.width+'&height='+data.height;
		kfm_pluginIframeShow(url);
		kfm_pluginIframeButton('kfm_cropToNew('+fid+',kfm_pluginIframeVar("coordinates"),kfm_pluginIframeVar("dimensions"))','Crop to new file');
		//this.openCropper(fid,url);
	}
	this.crop_image=function(fid){
		var data=File_getInstance(fid[0]);
		var url='plugins/cropper/croparea.php?id='+fid+'&width='+data.width+'&height='+data.height+'&options=both';
		var ifr=kfm_pluginIframeShow(url);
		kfm_pluginIframeButton('kfm_cropToOriginal('+fid+',kfm_pluginIframeVar("coordinates"),kfm_pluginIframeVar("dimensions"))','Crop');
		kfm_pluginIframeButton('kfm_cropToNew('+fid+',kfm_pluginIframeVar("coordinates"),kfm_pluginIframeVar("dimensions"))','Crop to new file');
		//this.openCropper(fid,url);
	}
}
	function kfm_cropToOriginal(id,coords,dimensions){
		if(!coords || !dimensions)return;
		kfm_fileLoader(id);
		var F=File_getInstance(id);
		kfm_pluginIframeHide();
		x_kfm_cropToOriginal(id, coords.x1, coords.y1, dimensions.width, dimensions.height, function(id){
			if($type(id)=='string')return kfm_log(id);
			F.setThumbnailBackground($('kfm_file_icon_'+id),true);
		});
	}
	function kfm_cropToNew(id, coords, dimensions){
		if(!coords || !dimensions)return;
		var filename=File_getInstance(id).name;
		kfm_prompt(kfm.lang.RenameFileToWhat(filename),filename,function(newName){
			if(!newName||newName==filename)return;
			kfm_pluginIframeHide();
			x_kfm_cropToNew(id, coords.x1, coords.y1, dimensions.width, dimensions.height, newName, kfm_refreshFiles);
		});
	}

/* add plugins to the hook system */
kfm_addHook(new plugin_cropper(),
	{mode:0,"extensions":["jpg","png","gif"], "category":"edit", "writable":1, title:"Crop image", doFunction:"crop_image"}
);
kfm_addHook(new plugin_cropper(),
	{mode:0,"extensions":["jpg","png","gif"], "category":"edit", "writable":0, title:"Crop to new image", doFunction:"crop_to_new"}
);


/** Temporary dump function, dumps no functions to avoid prototype functions */
function dump(arr,level) {
	var dumped_text = "";
	if(!level) level = 0;
	var level_padding = "";
	for(var j=0;j<level+1;j++) level_padding += "    ";

	if(typeof(arr) == 'object') { //Array/Hashes/Objects
		for(var item in arr) {
			
			var value = arr[item];
			if(typeof(value)=="function")continue;
			if(typeof(value) == 'object') { //If it is an array,
				dumped_text += level_padding + "'" + item + "' ...\n";
				dumped_text += dump(value,level+1);
			} else {
				dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
			}
		}
	} else { //Stings/Chars/Numbers etc.
	 dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
	}
	return dumped_text;
}
