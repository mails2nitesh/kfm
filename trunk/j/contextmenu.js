// see license.txt for licensing
function kfm_closeContextMenu(){
	delEl(contextmenu);
	contextmenu=null;
}
function kfm_contextmenuinit(){
	addEvent(getWindow(),'click',function(e){
		if(!contextmenu)return;
		var c=contextmenu,m=getMouseAt(e);
		var l=c.offsetLeft,t=c.offsetTop;
		if(m.x<l||m.x>l+c.offsetWidth||m.y<t||m.y>t+c.offsetHeight)kfm_closeContextMenu();
	});
	getWindow().oncontextmenu=function(e){
		e=getEvent(e);
		kfm_cancelEvent(e,1);
	}
}
function kfm_createContextMenu(m,links){
	if(!window.contextmenu_loading)kfm_closeContextMenu();
	if(!contextmenu){
		contextmenu=newEl('table',0,'contextmenu');
		contextmenu.addLink=function(href,text,icon){
			var row=this.addRow();
			row.addCell(0,0,(icon?newImg('themes/'+kfm_theme+'/icons/'+icon+'.png'):''),'kfm_contextmenu_iconCell');
			row.addCell(1,0,href!='javascript:kfm_0'?newLink(href+';kfm_closeContextMenu()',text):text);
		}
		window.contextmenu_loading=setTimeout('window.contextmenu_loading=null',1);
		document.body.addEl(contextmenu.setCss('left:'+m.x+'px;top:'+m.y+'px'));
	}
	else{
		var col=contextmenu.addRow().addCell();
		col.colSpan=2;
		col.addEl(newEl('hr'));
	}
	var i,rows=contextmenu.rows.length;
	for(i in links)if(links[i][1])contextmenu.addLink(links[i][0],links[i][1],links[i][2]);
	var w=contextmenu.offsetWidth,h=contextmenu.offsetHeight,ws=getWindowSize();
	if(h+m.y>ws.y)contextmenu.style.top=(ws.y-h)+'px';
	if(w+m.x>ws.x)contextmenu.style.left=(m.x-w)+'px';
}
