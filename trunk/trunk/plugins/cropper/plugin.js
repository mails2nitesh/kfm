function plugin_cropper(){
	/*defaults*/
	this.name="cropper";
	this.mode=0; //single files only
	this.title="Crop";
	this.extensions=["jpg","png","gif"];
	this.category="edit";
	this.writable=0; // non writable default

	this.crop_to_new=function(fid){
		var data=File_getInstance(fid);
		var url='plugins/cropper/croparea.php?id='+fid+'&width='+data.width+'&height='+data.height;
		this.openCropper(fid,url);
	}
	this.crop_image=function(fid){
		var data=File_getInstance(fid);
		var url='plugins/cropper/croparea.php?id='+fid+'&width='+data.width+'&height='+data.height+'&options=both';
		this.openCropper(fid,url);
	}
	this.doFunction=function(fid){
		alert('This is the default function which should have been overwritten');
	}
	this.openCropper=function(fid, url){
		var div=document.createElement('DIV');
		div.style.position='absolute';
		div.id='cropperdiv';
		div.style.top=0;
		div.style.left=0;
		div.style.width='100%';
		div.style.height='100%';
		div.style.backgroundColor='#ddf';
		div.onclick=function(){this.style.display='none';}
	
		var ifr = document.createElement('IFRAME');
		ifr.src = url;
		ifr.style.width = '100%';
		ifr.style.height = '100%'; //100% - 25px
		div.appendChild(ifr);
		document.body.appendChild(div);		
	}
}
	function kfm_cropToOriginal(id,coords,dimensions){
		var F=File_getInstance(id);
		document.getElementById('cropperdiv').style.display = 'none';
		x_kfm_cropToOriginal(id, coords.x1, coords.y1, dimensions.width, dimensions.height, function(id){
			if($type(id)=='string')return kfm_log(id);
			F.setThumbnailBackground($('kfm_file_icon_'+id),true);
		});
	}
	function kfm_cropToNew(id, coords, dimensions){
		var filename=File_getInstance(id).name;
		kfm_prompt(kfm.lang.RenameFileToWhat(filename),filename,function(newName){
			if(!newName||newName==filename)return;
			document.getElementById('cropperdiv').style.display = 'none';
			x_kfm_cropToNew(id, coords.x1, coords.y1, dimensions.width, dimensions.height, newName, kfm_refreshFiles);
		});
	}
/* end plugin defenition */

/* add plugins to the hook system */
kfm_addHook(new plugin_cropper(),
	{mode:0,"extensions":["jpg","png","gif"], "category":"edit", "writable":1, title:"Crop image", doFunction:"crop_image"}
);
kfm_addHook(new plugin_cropper(),
	{mode:0,"extensions":["jpg","png","gif"], "category":"edit", "writable":0, title:"Crop to new image", doFunction:"crop_to_new"}
);

/* end add plugins to the hook sytem */

/*
alert(dump(HooksMultipleWritable));
alert(dump(HooksMultipleReadonly));
alert(dump(HooksSingleWritable));
alert(dump(HooksSingleReadonly));
*/

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
