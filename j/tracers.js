// see license.txt for licensing
function kfm_tracer(f,t){
	var ef=$(f),et=$(t);
	if(!ef||!et)return;
	var wf=ef.offsetWidth,hf=ef.offsetHeight,wt=et.offsetWidth,ht=et.offsetHeight;
	var xf=getOffset(ef,'Left')+(wf/2),yf=getOffset(ef,'Top')+(hf/2),xt=getOffset(et,'Left')+(wt/2),yt=getOffset(et,'Top')+(ht/2);
	var d=Math.sqrt((xf-xt)*(xf-xt)+(yf-yt)*(yf-yt));
	if(d<5)return;
	var i=kfm_tracers.length;
	kfm_tracers[i]={
		x:xf,y:yf,width:wf,height:hf,opacity:.8,xSpeed:(xt-xf)/d,
		ySpeed:(yt-yf)/d,widthReductionSpeed:wf/d,heightReductionSpeed:hf/d,opacityReductionSpeed:.5/d
	}
	setTimeout('kfm_tracerStep('+i+')',40);
}
function kfm_tracerStep(id){
	var el=$('kfm_tracer'+id);
	if(!el){
		el=newEl('div','kfm_tracer'+id,'boxdroptracer');
		document.body.addEl(el);
	}
	kfm_tracers[id].x+=kfm_tracers[id].xSpeed*kfm_tracer_v;
	kfm_tracers[id].y+=kfm_tracers[id].ySpeed*kfm_tracer_v;
	kfm_tracers[id].width-=kfm_tracers[id].widthReductionSpeed*kfm_tracer_v;
	kfm_tracers[id].height-=kfm_tracers[id].heightReductionSpeed*kfm_tracer_v;
	kfm_tracers[id].opacity-=kfm_tracers[id].opacityReductionSpeed*kfm_tracer_v;
	if(kfm_tracers[id].width<1 && kfm_tracers[id].height<1){
		delEl(el);
		kfm_tracers[id]=null;
		return;
	}
	el.setCss('opacity:'+kfm_tracers[id].opacity+';width:'+kfm_tracers[id].width+'px;height:'+kfm_tracers[id].height+'px;left:'+parseInt(kfm_tracers[id].x-kfm_tracers[id].width/2)+'px;top:'+parseInt(kfm_tracers[id].y-kfm_tracers[id].height/2)+'px');
	setTimeout("kfm_tracerStep("+id+")",25);
}
