// see license.txt for licensing
function kfm_closeContextMenu(){
	if(contextmenu)contextmenu.remove();
	contextmenu=null;
}
function kfm_contextmenuinit(){
	document.addEvent('click',function(e){
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
function kfm_createContextMenu(m,links){
	if(!window.contextmenu_loading)kfm_closeContextMenu();
	if(!contextmenu){
		window.contextmenu=new Element('table',{
			'class':'contextmenu',
			'styles':{
				'left':m.x,
				'top':m.y
			}
		});
		window.contextmenu.addLink=function(href,text,icon,disabled,isSubMenu){
			if(disabled && !kfm_vars.show_disabled_contextmenu_links)return;
			var row=kfm.addRow(this);
			if(disabled){
				row.className+=' disabled';
				href='';
			}
			if(isSubMenu){
				link=newLink('javascript:kfm_cm_openSubMenu("'+href+'",this);',text);
				row.addClass('is_submenu');
			}
			else if(href=='kfm_0')link=text;
			else link=newLink('javascript:kfm_closeContextMenu();'+href,text);
			kfm.addCell(row,0,0,(icon?new Element('img',{src:'themes/'+kfm_theme+'/icons/'+icon+'.png'}):''),'kfm_contextmenu_iconCell');
			kfm.addCell(row,1,0,link,'kfm_contextmenu_nameCell');
		};
		window.contextmenu_loading=setTimeout('window.contextmenu_loading=null',1);
		document.body.appendChild(contextmenu);
	}
	else{
		var col=kfm.addCell(kfm.addRow(contextmenu));
		col.colSpan=2;
		col.appendChild(new Element('hr'));
	}
	var rows=contextmenu.rows.length;
	for(var i=0;i<links.length;++i)if(links[i][1])contextmenu.addLink(links[i][0],links[i][1],links[i][2],links[i][3],links[i][4]);
	var w=contextmenu.offsetWidth,h=contextmenu.offsetHeight,ws=window.getSize().size;
	if(h+m.y>ws.y)contextmenu.style.top=(ws.y-h)+'px';
	if(w+m.x>ws.x)contextmenu.style.left=(m.x-w)+'px';
}
function kfm_addContextMenu(el,fn){
	if(window.webkit)el.oncontextmenu=function(e){
		fn(new Event(e));
	}
	else el.addEvent(window.webkit&&!window.webkit420?'mousedown':'contextmenu',function(e){
		e=new Event(e);
		if(e.type=='contextmenu' || e.rightClick)fn(e);
	});
	return el;
}
kfm.cm={
	submenus:[]
}
