// see license.txt for licensing
function kfm_closeContextMenu(){
	if(contextmenu)contextmenu.remove();
	contextmenu=null;
}
function kfm_contextmenuinit(){
	document.addEvent('click',function(e){
		if(!contextmenu)return;
		var c=contextmenu,m=getMouseAt(e);
		var l=c.offsetLeft,t=c.offsetTop;
		if(m.x<l||m.x>l+c.offsetWidth||m.y<t||m.y>t+c.offsetHeight)kfm_closeContextMenu();
	});
	document.addEvent('contextmenu',function(e){
		e=new Event(e);
		if(!e.control)e.stop();
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
		window.contextmenu.addLink=function(href,text,icon,disabled){
			if(disabled && !kfm_vars.show_disabled_contextmenu_links)return;
			var row=kfm.addRow(this);
			if(disabled){
				row.className+=' disabled';
				href='';
			}
			var link=(href!='kfm_0')?newLink('javascript:kfm_closeContextMenu();'+href,text):text;
			kfm.addCell(row,0,0,(icon?new Element('img',{src:'themes/'+kfm_theme+'/icons/'+icon+'.png'}):''),'kfm_contextmenu_iconCell');
			kfm.addCell(row,1,0,link);
		};
		window.contextmenu_loading=setTimeout('window.contextmenu_loading=null',1);
		kfm.addEl(document.body,contextmenu);
	}
	else{
		var col=kfm.addCell(kfm.addRow(contextmenu));
		col.colSpan=2;
		kfm.addEl(col,new Element('hr'));
	}
	var rows=contextmenu.rows.length;
	for(var i=0;i<links.length;++i)if(links[i][1])contextmenu.addLink(links[i][0],links[i][1],links[i][2],links[i][3]);
	var w=contextmenu.offsetWidth,h=contextmenu.offsetHeight,ws=window.getSize().size;
	if(h+m.y>ws.y)contextmenu.style.top=(ws.y-h)+'px';
	if(w+m.x>ws.x)contextmenu.style.left=(m.x-w)+'px';
}
