// see license.txt for licensing
function kfm_addContextMenu(el,fn){
	var evtype='contextmenu';
	if(window.webkit&&!window.webkit420)evtype='mousedown'; // Safari, Konqueror
	if($j.browser.opera)evtype='mousedown'; // Opera
	$j.event.add(el,evtype,function(e){
		if(e.type=='contextmenu' || e.button==2)fn(e);
	});
	return el;
}
function kfm_contextmenuinit(){
	$j.event.add(document,'click',function(e){
		if(e.ctrlKey)return;
		if(!contextmenu)return;
		var c=contextmenu,m={x:e.pageX,y:pageY};
		var l=c.offsetLeft,t=c.offsetTop;
		if(m.x<l||m.x>l+c.offsetWidth||m.y<t||m.y>t+c.offsetHeight)kfm_closeContextMenu();
	});
	kfm_addContextMenu(document,function(e){
		if(window.webkit||!e.ctrlKey)e.stopPropagation();
	});
}
kfm.cm={
	submenus:[]
}
llStubs.push('kfm_closeContextMenu');
llStubs.push('kfm_createContextMenu');
// fix to hide normal context menu in Safari/Chrome
document.oncontextmenu = function(e){return false;}
