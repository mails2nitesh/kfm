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
function newEl(t,id,cn,chld,vals,css){
	if(t=='iframe')return newEl('<iframe name="'+id+'" src="empty"></iframe>');
	var el=document.createElement(t);
	if(id){
		el.id=id;
		el.name=id;
	}
	if(cn)el.className=cn;
	if(chld)kfm_addEl(el,chld);
	if(vals)$extend(el,vals);
	if(css)el.setStyles(css);
	return el;
}
function newForm(action,method,enctype,target){
	return newEl('<form action="'+action+'" method="'+method+'" enctype="'+enctype+'" target="'+target+'"></form>');
}
function removeEvent(o,t,f){
	if(!o)return;
	if(!o[t+f])return;
	o.detachEvent('on'+t,o['e'+t+f]);
	o[t+f]=null;
}
