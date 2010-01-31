function plugin_image_resize(){
	this.name='image_resize';
	this.title='resize image';
	this.mode=0;//single files
	this.writable=1;//writable files
	this.category="edit";
	this.extensions=['jpg','png','gif'];
	this.doFunction=function(files){
		kfm_resize_image(files[0]);
	}
}
if(kfm_vars.permissions.file.ed&&kfm_vars.permissions.image.manip){
	kfm_addHook(new plugin_image_resize());
	kfm_addHook(new plugin_image_resize(),{title:'Resize images',mode:1,doFunction:function(files){kfm_resize_images(files);}});
}
function kfm_resize_image(id){
	var F=File_getInstance(id);
	var txt=kfm.lang.CurrentSize(F.width,F.height);
	kfm_prompt(txt+kfm.lang.NewWidth,F.width,function(x){
		x=parseInt(x);
		if(!x)return;
		txt+=kfm.lang.NewWidthConfirmTxt(x);
		kfm_prompt(txt+kfm.lang.NewHeight,Math.ceil(F.height*(x/F.width)),function(y){
			y=parseInt(y);
			if(!y)return;
			if(kfm.confirm(txt+kfm.lang.NewHeightConfirmTxt(y))){
				kfm_fileLoader(id);
				//x_kfm_resizeImage(id,x,y,kfm_refreshFiles);
				x_kfm_resizeImage(id,x,y,function(){
					x_kfm_getFileDetails(id,function(res){
						File_setData(res);
						F.setThumbnailBackground(document.getElementById('kfm_file_icon_'+id));
					});
				});
			}
		});
	});
}
function kfm_resize_images(files){
	var id=files[0];
	var imgs=0,width=0;height=0,imgfiles=[];
	{ // figure out average width/height
		for(var i=0;i<files.length;++i){
			var F=File_getInstance(files[i]);
			if(!F.width || !F.height)continue;
			width+=F.width;
			height+=F.height;
			++imgs;
			imgfiles.push(files[i]);
		}
		if(!imgs)return;
		width=+(width/imgs);
		height=+(height/imgs);
	}
	var txt=kfm.lang.CurrentSize(width,height);
	kfm_prompt(txt+kfm.lang.NewWidth,width,function(x){
		x=parseInt(x);
		if(!x)return;
		txt+=kfm.lang.NewWidthConfirmTxt(x);
		kfm_prompt(txt+kfm.lang.NewHeight,Math.ceil(height*(x/width)),function(y){
			y=parseInt(y);
			if(!y)return;
			if(kfm.confirm(txt+kfm.lang.NewHeightConfirmTxt(y))){
				kfm_fileLoader(imgfiles);
				x_kfm_resizeImages(imgfiles,x,y,function(){
					imgfiles.each(function(id){
						var F=File_getInstance(id);
						x_kfm_getFileDetails(id,function(res){
							File_setData(res);
							F.setThumbnailBackground(document.getElementById('kfm_file_icon_'+id));
						});
					});
				});
			}
		});
	});
}
