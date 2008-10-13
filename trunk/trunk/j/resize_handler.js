// see license.txt for licensing
function kfm_resizeHandler(){
	var w,win,i,el,iframe;
	win=$j(window);
	w={x:win.width(),y:win.height()};
	for(i=0;i<kfm_resizeHandler_maxHeights.length;++i)if(document.getElementById(kfm_resizeHandler_maxHeights[i]))document.getElementById(kfm_resizeHandler_maxHeights[i]).style.height=w.y+'px';
	for(i=0;i<kfm_resizeHandler_maxWidths.length;++i)if(document.getElementById(kfm_resizeHandler_maxWidths[i]))document.getElementById(kfm_resizeHandler_maxWidths[i]).style.width=w.x+'px';
	el=document.getElementById('kfm_codepressTableCell');
	if(el){
		iframe=$j('iframe',el)[0];
		if(iframe){
			iframe.style.height=0;
			iframe.style.width=0;
			iframe.style.height=(el.offsetHeight-10)+'px';
			iframe.style.width=(el.offsetWidth-10)+'px';
		}
	}
	kfm_refreshPanels('kfm_left_column');
	$j('body *').each(function(key,el){
		if(el.parentResized)el.parentResized();
	});
}
function kfm_resizeHandler_add(name){
	kfm_resizeHandler_addMaxWidth(name);
	kfm_resizeHandler_addMaxHeight(name);
}
function kfm_resizeHandler_addMaxHeight(name){
	if(kfm_resizeHandler_maxHeights.indexOf(name)==-1)kfm_resizeHandler_maxHeights.push(name);
}
function kfm_resizeHandler_addMaxWidth(name){
	if(kfm_resizeHandler_maxWidths.indexOf(name)==-1)kfm_resizeHandler_maxWidths.push(name);
}
function kfm_resizeHandler_remove(name){
	kfm_resizeHandler_removeMaxWidth(name);
	kfm_resizeHandler_removeMaxHeight(name);
}
function kfm_resizeHandler_removeMaxHeight(name){
	if(kfm_resizeHandler_maxHeights.indexOf(name)!=-1)kfm_resizeHandler_maxHeights=array_remove_values(kfm_resizeHandler_maxHeights,name);
}
function kfm_resizeHandler_removeMaxWidth(name){
	if(kfm_resizeHandler_maxWidths.indexOf(name)!=-1)kfm_resizeHandler_maxWidths=array_remove_values(kfm_resizeHandler_maxWidths,name);
}
var kfm_resizeHandler_maxHeights=[];
var kfm_resizeHandler_maxWidths=[];
