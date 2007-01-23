// see license.txt for licensing
function kfm_changeCaption(id){
	var el=kfm_filesCache[id],txt=kfm_lang.ChangeCaption+el.image_data.caption;
	var newCaption=kfm_prompt(txt,el.image_data.caption);;
	if(!newCaption||newCaption==el.image_data.caption)return;
	if(confirm(kfm_lang.NewCaptionIsThisCorrect(newCaption))){
		kfm_filesCache[id]=null;
		kfm_log(kfm_lang.log_ChangeCaption(id,newCaption));
		x_kfm_changeCaption(id,newCaption,kfm_refreshFiles);
	}
}
function kfm_resizeImage(id){
	var el=kfm_filesCache[id],txt=kfm_lang.CurrentSize(el.image_data.width,el.image_data.height);
	var x=parseInt(kfm_prompt(txt+kfm_lang.NewWidth,el.image_data.width));
	if(!x)return;
	txt+=kfm_lang.NewWidthConfirmTxt(x);
	var y=parseInt(kfm_prompt(txt+kfm_lang.NewHeight,Math.ceil(el.image_data.height*(x/el.image_data.width))));
	if(!y)return;
	if(confirm(txt+kfm_lang.NewHeightConfirmTxt(y))){
		kfm_filesCache[id]=null;
		x_kfm_resizeImage(id,x,y,kfm_refreshFiles);
	}
}
function kfm_rotateImage(filename,direction){
	kfm_filesCache[filename]=null;
	x_kfm_rotateImage(filename,direction,kfm_refreshFiles);
}
function kfm_showIcon(res,el2){
	if(!isArray(res)){
		if(res)kfm_log(res);
		return;
	}
	var file=res[0],image_data=res[1];
	var el=(el2&&!isArray(el2))?el2:$('kfm_file_icon_'+file);
	if(!el||!image_data)return;
	if(image_data.caption){
		if(el.title)el.title+=', caption: ';
		el.title+=image_data.caption.replace(/\n/g,' ');
	}
	if(image_data.icon){
		if(!kfm_filesCache[file])image_data.icon=image_data.icon+'?'+Math.random();
		var img=newImg(image_data.icon).setCss('width:1px;height:1px');
		img.onload=function(){
			var p=this.parentNode;
			p.setCss('backgroundImage:url("'+p.kfm_attributes.image_data.icon+'")');
			delEl(this);
		}
		el.addEl(img);
		el.kfm_attributes.image_data=image_data;
		kfm_filesCache[file]=el.kfm_attributes;
	}
}
function kfm_showImage(url){
	window.open(url,'kfm_image');
}
