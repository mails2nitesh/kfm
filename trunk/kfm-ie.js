// see license.txt for licensing
function kfm_cancelEvent(e,c){
	e.cancelBubble=true;
	if(c)e.returnValue=false; // contextmenu
}
function kfm_getWindow(){
	return document.body;
}

function XMLHttpRequest(){
	var l=(ScriptEngineMajorVersion()>=5)?"Msxml2":"Microsoft";
	return new ActiveXObject(l+".XMLHTTP")
}
function clearSelections(){
	document.selection.empty();
}
function getEventTarget(e){
	return window.event.srcElement;
}
function getWindowScrollAt(){
	var d=document.body;
	if(d.scrollLeft||d.scrollTop)return {x:d.scrollLeft,y:d.scrollTop};
	d=document.documentElement;
	return {x:d.scrollLeft,y:d.scrollTop};
}
function getWindowSize(){
	var a=document.documentElement,b=document.body;
	if(a&&(a.clientWidth||a.clientHeight))return {x:a.clientWidth,y:a.clientHeight};
	return {x:b.clientWidth,y:b.clientHeight};
}
function newEl(t,id,cn,chld){
	if(t=='iframe')return newEl('<iframe name="'+id+'" src="empty"></iframe>');
	var el=document.createElement(t);
	if(id){
		el.id=id;
		el.name=id;
	}
	kfm_addMethods(el);
	el.setClass(cn);
	el.addEl(chld);
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
function setFloat(e,f){
	e.style.styleFloat=f;
}
function setOpacity(e,o){
	e.style.filter='alpha(opacity='+(o*100)+')';
}
