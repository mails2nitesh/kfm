function plugin_lightbox(){
	this.name='lightbox';
	this.title='view slideshow';
	this.category='view';
	this.extensions='all'; // for now extensions for multiple files is not yet supported
	this.workextensions=['jpg','png','gif','svg'];
	this.mode=1;//multiple files
	this.writable=2;//all
	this.doFunction=function(files){
		var imgs=[];
		for(var i=0;i<files.length;i++){
	      var F=File_getInstance(files[i]);
	      var ext=F.name.replace(/.*\./,'').toLowerCase();
			for(var j=0;j<this.workextensions.length;j++)if(ext==this.workextensions[j]){
				imgs.push(files[i]);
				continue;
			}
		}
		if(!imgs.length>0)return;
		kfm_img_startLightbox(imgs);
	}
	this.displayCheck=function(files){
		for(var i=0;i<files.length;i++){
         var F=File_getInstance(files[i]);
         var ext=F.name.replace(/.*\./,'').toLowerCase();
			for(var j=0;j<this.workextensions.length;j++)if(ext==this.workextensions[j])return 1; //slideshow option
		}
		return 2; //no images in selection=>inactive
	}
}
kfm_addHook(new plugin_lightbox());
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
		document.body.appendChild(wrapper);
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
		wrapper.appendChild(el);
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
	wrapper.appendChild(el);
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
