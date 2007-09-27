// see ../license.txt for licensing
function kfm_changeCaption(id){
	var table=$extend(new Element('table',{
		'id':'kfm_newCaptionDetails'
	}),{kfm_caption_for:id});
	var row=table.insertRow(0),textarea=newInput('kfm_new_caption','textarea',File_getInstance(id).caption);
	textarea.setStyles('height:50px;width:200px');
	row.insertCell(0).appendChild(newText(kfm.lang.NewCaption));
	row.insertCell(1).appendChild(textarea);
	kfm_modal_open(table,kfm.lang.ChangeCaption,[[kfm.lang.ChangeCaption,kfm_changeCaption_set]]);
	$('kfm_new_caption').focus();
}
function kfm_changeCaption_set(){
	var id=$('kfm_newCaptionDetails').kfm_caption_for,newCaption=$('kfm_new_caption').value;
	if(!newCaption||newCaption==File_getInstance(id).caption)return;
	kfm_modal_close();
	if(kfm.confirm(kfm.lang.NewCaptionIsThisCorrect(newCaption))){
		kfm_log(kfm.lang.Log_ChangeCaption(id,newCaption));
		x_kfm_changeCaption(id,newCaption,kfm_refreshFiles);
	}
}
function kfm_img_startLightbox(id){
	window.lightbox_oldCM=$('kfm_right_column').contentMode;
	$('kfm_right_column').contentMode='lightbox';
	if(id&&$type(id)=='array'){
		window.kfm_slideshow={ids:id,at:0};
		id=0;
	}
	if(!id){
		window.kfm_slideshow.at++;
		document.title='KFM Slideshow: '+window.kfm_slideshow.at;
		id=window.kfm_slideshow.ids[window.kfm_slideshow.at%window.kfm_slideshow.ids.length];
	}
	var el,data=File_getInstance(id),ws=window.getSize().size,oldEl=$('kfm_lightboxImage'),wrapper=$('kfm_lightboxWrapper');
	if(!wrapper){
		wrapper=new Element('div',{
			'id':'kfm_lightboxWrapper',
			'styles':{
				'position':'absolute',
				'left':0,
				'z-index':1,
				'top':0,
				'width':ws.x,
				'height':ws.y
			}
		});
		wrapper.addEvent('click',kfm_img_stopLightbox);
		kfm.addEl(document.body,wrapper);
		wrapper.focus();
	}
	if(!$('kfm_lightboxShader')){
		el=new Element('div',{
			'id':'kfm_lightboxShader',
			'styles':{
				'width':ws.x,
				'height':ws.y,
				'background':'#000',
				'opacity':'.7'
			}
		});
		kfm.addEl(wrapper,el);
	}
	if(oldEl)oldEl.remove();
	var w=data.width,h=data.height,url='get.php?id='+id,r=0;
	if(!w||!h){
		kfm_log(kfm.lang.NotAnImageOrImageDimensionsNotReported);
		return kfm_img_stopLightbox();
	}
	if(w>ws.x*.9||h>ws.y*.9){
		if(w>ws.x*.9){
			r=.9*ws.x/w;
			w*=r;
			h*=r;
		}
		if(h>ws.y*0.9){
			r=.9*ws.y/h;
			w*=r;
			h*=r;
		}
		url+='&width='+parseInt(w)+'&height='+parseInt(h);
	}
	el=new Element('img',{
		'id':'kfm_lightboxImage',
		'src':url,
		'styles':{
			'position':'absolute',
			'left':parseInt((ws.x-w)/2),
			'top':parseInt((ws.y-h)/2),
			'z-index':2
		}
	});
	if(window.kfm_slideshow&&!window.kfm_slideshow_stopped){
		el.addEvent('load',function(){
			window.lightbox_slideshowTimer=setTimeout('kfm_img_startLightbox()',kfm_slideshow_delay);
		});
	}
	kfm.addEl(wrapper,el);
	kfm_resizeHandler_add('kfm_lightboxShader');
	kfm_resizeHandler_add('kfm_lightboxWrapper');
}
function kfm_img_stopLightbox(e){
	e=new Event(e);
	if(e.rightClick)return;
	var wrapper=$('kfm_lightboxWrapper');
	if(wrapper)wrapper.remove();
	window.kfm_slideshow=window.kfm_slideshow_stopped=null;
	if(window.lightbox_slideshowTimer)clearTimeout(window.lightbox_slideshowTimer);
	$('kfm_right_column').contentMode=window.lightbox_oldCM;
	kfm_resizeHandler_remove('kfm_lightboxShader');
	kfm_resizeHandler_remove('kfm_lightboxWrapper');
}
function kfm_resizeImage(id){
	var data=File_getInstance(id);
	var txt=kfm.lang.CurrentSize(data.width,data.height);
	kfm_prompt(txt+kfm.lang.NewWidth,data.width,function(x){
		x=parseInt(x);
		if(!x)return;
		txt+=kfm.lang.NewWidthConfirmTxt(x);
		kfm_prompt(txt+kfm.lang.NewHeight,Math.ceil(data.height*(x/data.width)),function(y){
			y=parseInt(y);
			if(!y)return;
			if(kfm.confirm(txt+kfm.lang.NewHeightConfirmTxt(y)))x_kfm_resizeImage(id,x,y,kfm_refreshFiles);
		});
	});
}
function kfm_returnThumbnail(id,size){
	if(!size)size='64x64';
	valid=1;
	kfm_prompt(kfm.lang.WhatMaximumSize,size,function(size){
		if(!size)return;
		if(!/^[0-9]+x[0-9]+$/.test(size)){
			alert('The size must be in the format XXxYY, where X is the width and Y is the height');
			valid=0;
		}
		if(!valid)return kfm_returnThumbnail(id,size);
		var x=size.replace(/x.*/,''),y=size.replace(/.*x/,'');
		x_kfm_getFileUrl(id,x,y,function(url){
			if(kfm_file_handler=='return'||kfm_file_handler=='fckeditor'){
				window.opener.SetUrl(url,0,0,File_getInstance(id).caption);
				window.close();
			}
			else if(kfm_file_handler=='download'){
				if(/get.php/.test(url))url+='&forcedownload=1';
				document.location=url;
			}
		});
	});
}
function kfm_rotateImage(id,direction){
	var F=File_getInstance(id);
	x_kfm_rotateImage(id,direction,function(id){
		if($type(id)=='string')return kfm_log(id);
		F.setThumbnailBackground($('kfm_file_icon_'+id),true);
	});
}
