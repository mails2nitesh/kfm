// see ../license.txt for licensing
function kfm_cancelEvent(e,c){
	e.cancelBubble=true;
	if(c)e.returnValue=false; // contextmenu
}

function clearSelections(){
	document.selection.empty();
}
function getWindowScrollAt(){
	var d=document.body;
	if(d.scrollLeft||d.scrollTop)return {x:d.scrollLeft,y:d.scrollTop};
	d=document.documentElement;
	return {x:d.scrollLeft,y:d.scrollTop};
}
function removeEvent(o,t,f){
	if(!o)return;
	if(!o[t+f])return;
	o.detachEvent('on'+t,o['e'+t+f]);
	o[t+f]=null;
}
