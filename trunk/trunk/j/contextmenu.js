// see license.txt for licensing
function kfm_addContextMenu(el,fn){
	$j.event.add(el,window.webkit&&!window.webkit420?'mousedown':'contextmenu',function(e){
		e=new Event(e);
		if(e.type=='contextmenu' || e.rightClick)fn(e);
	});
	return el;
}
function kfm_contextmenuinit(){
	$j.event.add(document,'click',function(e){
		e=new Event(e);
		if(e.control)return;
		if(!contextmenu)return;
		var c=contextmenu,m=e.page;
		var l=c.offsetLeft,t=c.offsetTop;
		if(m.x<l||m.x>l+c.offsetWidth||m.y<t||m.y>t+c.offsetHeight)kfm_closeContextMenu();
	});
	kfm_addContextMenu(document,function(e){
		if(window.webkit||!e.control)e.stop();
	});
}
kfm.cm={
	submenus:[]
}
llStubs.push('kfm_closeContextMenu');
llStubs.push('kfm_createContextMenu');
