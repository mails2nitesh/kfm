// see ../license.txt for licensing
function kfm_changeCaption(id){
	var table=newEl('table','kfm_newCaptionDetails',0,0,{kfm_caption_for:id});
	var row=table.insertRow(0),textarea=newInput('kfm_new_caption','textarea',$('kfm_file_icon_'+id).kfm_attributes.caption);
	textarea.setCss('height:50px;width:200px');
	row.insertCell(0).appendChild(newText(kfm_lang.NewCaption));
	row.insertCell(1).appendChild(textarea);
	kfm_modal_open(table,kfm_lang.ChangeCaption,[[kfm_lang.ChangeCaption,'kfm_changeCaption_set']]);
	$('kfm_new_caption').focus();
}
function kfm_changeCaption_set(){
	var id=$('kfm_newCaptionDetails').kfm_caption_for,newCaption=$('kfm_new_caption').value;
	if(!newCaption||newCaption==$('kfm_file_icon_'+id).kfm_attributes.caption)return;
	kfm_modal_close();
	if(kfm_confirm(kfm_lang.NewCaptionIsThisCorrect(newCaption))){
		kfm_filesCache[id]=null;
		kfm_log(kfm_lang.log_ChangeCaption(id,newCaption));
		x_kfm_changeCaption(id,newCaption,kfm_refreshFiles);
	}
}
function kfm_resizeImage(id){
	var data=$('kfm_file_icon_'+id).kfm_attributes;
	var el=kfm_filesCache[id],txt=kfm_lang.CurrentSize(data.width,data.height);
	var x=parseInt(kfm_prompt(txt+kfm_lang.NewWidth,data.width));
	if(!x)return;
	txt+=kfm_lang.NewWidthConfirmTxt(x);
	var y=parseInt(kfm_prompt(txt+kfm_lang.NewHeight,Math.ceil(data.height*(x/data.width))));
	if(!y)return;
	if(kfm_confirm(txt+kfm_lang.NewHeightConfirmTxt(y))){
		kfm_filesCache[id]=null;
		x_kfm_resizeImage(id,x,y,kfm_refreshFiles);
	}
}
function kfm_returnThumbnail(id){
	var size;
	do{
		valid=1;
		size=kfm_prompt(kfm_lang.WhatMaximumSize,'64x64');
		if(!size)return;
		if(!/^[0-9]+x[0-9]+$/.test(size)){
			alert('The size must be in the format XXxYY, where X is the width and Y is the height');
			valid=0;
		}
	}while(!valid);
	var x=size.replace(/x.*/,''),y=size.replace(/.*x/,'');
	x_kfm_getFileUrl(id,x,y,function(url){
		if(kfm_file_handler=='return'||kfm_file_handler=='fckeditor'){
			window.opener.SetUrl(url,0,0,$('kfm_file_icon_'+id).kfm_attributes.caption);
			window.close();
		}
		else if(kfm_file_handler=='download'){
			if(/get.php/.test(url))url+='&forcedownload=1';
			document.location=url;
		}
	});
}
function kfm_rotateImage(filename,direction){
	kfm_filesCache[filename]=null;
	x_kfm_rotateImage(filename,direction,kfm_refreshFiles);
}
function kfm_showImage(url){
	window.open(url,'kfm_image');
}
