// see ../license.txt for licensing
function kfm_addToSelection(id){
	if(!id)return;
	selectedFiles.push(id);
	$('kfm_file_icon_'+id).className+=' selected';
	if(kfm_log_level>0)kfm_log(kfm.lang.FileSelected(id));
	kfm_selectionCheck();
}
function kfm_chooseFile(e,o){
	e=new Event(e);
	var el=(o?e:e.target).kfm_attributes;
	x_kfm_getFileUrl(el.id,function(url){
		if(kfm_file_handler=='return'||kfm_file_handler=='fckeditor'){
			if(!el.width)window.opener.SetUrl(url);
			else window.opener.SetUrl(url.replace(/([^:]\/)\//g,'$1'),0,0,$('kfm_file_icon_'+el.id).kfm_attributes.caption);
			setTimeout('window.close()',1);
		}
		else if(kfm_file_handler=='download'){
			if(/get.php/.test(url))url+='&forcedownload=1';
			document.location=url;
		}
	});
}
function kfm_file_drag(e){
	if(!window.dragType||window.dragType!=1)return;
	clearSelections();
	var m=getMouseAt(e);
	var w=drag_wrapper.offsetWidth,h=drag_wrapper.offsetHeight,ws=getWindowSize();
	var x=(w+m.x>ws.x-16)?ws.x-w:m.x+16;
	var y=(h+m.y>ws.y)?ws.y-h:m.y;
	if(x<0)x=0;
	if(y<0)y=0;
	window.drag_wrapper.setStyles('display:block;left:'+x+'px;top:'+y+'px');
}
function kfm_file_dragFinish(e){
	$clear(window.dragTrigger);
	if(!window.dragType||window.dragType!=1)return;
	window.dragType=0;
	window.drag_wrapper.remove();
	window.drag_wrapper=null;
	document.removeEvent('mousemove',kfm_file_drag);
	document.removeEvent('mouseup',kfm_file_dragFinish);
	if(kfm_directory_over)dir_over=kfm_directory_over;
	else{ // workaround for Firefox which seems to have trouble with onmouseover for the directories while dragging
		var a=kfm.getContainer(getMouseAt(e),$$('div.kfm_directory_link'));
		dir_over=a?a.node_id:'.';
	}
	if(dir_over=='.'||dir_over==kfm_cwd_id)return;
	{ // build context menu for "copy/move"
		var links=[];
		links.push(['x_kfm_copyFiles(['+selectedFiles.join(',')+'],'+dir_over+',kfm_showMessage);kfm_selectNone()','copy files']);
		links.push(['x_kfm_moveFiles(['+selectedFiles.join(',')+'],'+dir_over+',function(){kfm_removeFilesFromView(['+selectedFiles.join(',')+'])});kfm_selectNone()','move files',0,!kfm_vars.permissions.file.mv]);
		kfm_createContextMenu(getMouseAt(getEvent(e)),links);
	}
}
function kfm_file_dragStart(filename){
	if(!kfm_isFileSelected(filename))kfm_addToSelection(filename);
	if(!selectedFiles.length)return;
	window.dragType=1;
	var w=getWindowSize();
	window.drag_wrapper=new Element('div',{
		'id':'kfm_drag_wrapper',
		styles:{
			'display':'none',
			'opacity':'.7'
		}
	});
	for(var i=0;i<10&&i<selectedFiles.length;++i)kfm.addEl(window.drag_wrapper,[$('kfm_file_icon_'+selectedFiles[i]).kfm_attributes.name,new Element('br')]);
	if(selectedFiles.length>10)kfm.addEl(
		window.drag_wrapper,
		(new Element('i')).setHTML(kfm.lang.AndNMore(selectedFiles.length-10))
	);
	kfm.addEl(document.body,window.drag_wrapper);
	document.addEvent('mousemove',kfm_file_drag);
}
function kfm_isFileSelected(filename){
	return kfm_inArray(filename,selectedFiles);
}
function kfm_removeFromSelection(id){
	var i;
	for(i=0;i<selectedFiles.length;++i){
		if(selectedFiles[i]==id){
			var el=$('kfm_file_icon_'+id);
			if(el)el.removeClass('selected');
			kfm_selectionCheck();
			return selectedFiles.splice(i,1);
		}
	}
}
function kfm_selectAll(){
	kfm_selectNone();
	var a,b=$('kfm_right_column').fileids;
	for(a=0;a<b.length;++a)kfm_addToSelection(b[a]);
}
function kfm_selectInvert(){
	var a,b=$('kfm_right_column').fileids;
	for(a=0;a<b.length;++a)if(kfm_isFileSelected(b[a]))kfm_removeFromSelection(b[a]);
	else kfm_addToSelection(b[a]);
}
function kfm_selectNone(){
	if(kfm_lastClicked)$('kfm_file_icon_'+kfm_lastClicked).removeClass('last_clicked');
	for(var i=selectedFiles.length;i>-1;--i)kfm_removeFromSelection(selectedFiles[i]);
	kfm_lastClicked=0;
	kfm_selectionCheck();
}
function kfm_selectionCheck(){
	if(selectedFiles.length==1){
		$E('#kfm_file_details_panel div.kfm_panel_body').innerHTML='loading';
		kfm_run_delayed('file_details','if(selectedFiles.length==1)x_kfm_getFileDetails(selectedFiles[0],kfm_showFileDetails);');
	}
	else kfm_run_delayed('file_details','if(!selectedFiles.length)kfm_showFileDetails();');
}
function kfm_selection_drag(e){
	if(!window.dragType||window.dragType!=2||!window.drag_wrapper)return;
	clearSelections();
	var p1=getMouseAt(e),p2=window.drag_wrapper.orig;
	var x1=p1.x>p2.x?p2.x:p1.x;
	var x2=p2.x>p1.x?p2.x:p1.x;
	var y1=p1.y>p2.y?p2.y:p1.y;
	var y2=p2.y>p1.y?p2.y:p1.y;
	window.drag_wrapper.setStyles('display:block;left:'+x1+'px;top:'+y1+'px;width:'+(x2-x1)+'px;height:'+(y2-y1)+'px;zIndex:4');
}
function kfm_selection_dragFinish(e){
	$clear(window.dragSelectionTrigger);
	if(!window.dragType||window.dragType!=2||!window.drag_wrapper)return;
	var right_column=$('kfm_right_column'),p1=getMouseAt(e),p2=window.drag_wrapper.orig,offset=right_column.scrollTop;
	var x1=p1.x>p2.x?p2.x:p1.x,x2=p2.x>p1.x?p2.x:p1.x,y1=p1.y>p2.y?p2.y:p1.y,y2=p2.y>p1.y?p2.y:p1.y;
	setTimeout('window.dragType=0;',1); // pause needed for IE
	window.drag_wrapper.remove();
	window.drag_wrapper=null;
	document.removeEvent('mousemove',kfm_selection_drag);
	document.removeEvent('mouseup',kfm_selection_dragFinish);
	var fileids=right_column.fileids;
	kfm_selectNone();
	for(var i=0;i<fileids.length;++i){
		var curIcon=$('kfm_file_icon_'+fileids[i]);
		var curTop=getOffset(curIcon,'Top');
		var curLeft=getOffset(curIcon,'Left');
		if((curLeft+curIcon.offsetWidth)>x1&&curLeft<x2&&(curTop+curIcon.offsetHeight)>y1&&curTop<y2)kfm_addToSelection(fileids[i]);
	}
	kfm_selectionCheck();
}
function kfm_selection_dragStart(e){
	if(window.dragType)return;
	if (window.mouseAt.x > $('kfm_right_column').scrollWidth + $('kfm_left_column').scrollWidth) return;
	window.dragType=2;
	var w=getWindowSize();
	document.addEvent('mouseup',kfm_selection_dragFinish);
	window.drag_wrapper=new Element('div',{
		'id':'kfm_selection_drag_wrapper',
		'styles':{
			'display':'none'
		}
	});
	window.drag_wrapper.orig=window.mouseAt;
	kfm.addEl(document.body,window.drag_wrapper);
	document.addEvent('mousemove',kfm_selection_drag);
}
function kfm_shiftFileSelectionLR(dir){
	if(selectedFiles.length>1)return;
	var na=$('kfm_right_column').fileids,a=0,ns=na.length;
	if(selectedFiles.length){
		for(;a<ns;++a)if(na[a]==selectedFiles[0])break;
		if(dir>0){if(a==ns-1)a=-1}
		else if(!a)a=ns;
	}
	else a=dir>0?-1:ns;
	kfm_selectSingleFile(na[a+dir]);
}
function kfm_shiftFileSelectionUD(dir){
	if(selectedFiles.length>1)return;
	var na=$('kfm_right_column').fileids,a=0,ns=na.length,icons_per_line=0,topOffset=$('kfm_file_icon_'+na[0]).offsetTop;
	if(selectedFiles.length){
		if(topOffset==$('kfm_file_icon_'+na[ns-1]).offsetTop)return; // only one line of icons
		for(;$('kfm_file_icon_'+na[icons_per_line]).offsetTop==topOffset;++icons_per_line);
		for(;a<ns;++a)if(na[a]==selectedFiles[0])break; // what is the selected file
		a+=icons_per_line*dir;
		if(a>=ns)a=ns-1;
		if(a<0)a=0;
	}
	else a=dir>0?0:ns-1;
	kfm_selectSingleFile(na[a]);
}
function kfm_toggleSelectedFile(e){
	e=new Event(e);
	kfm.cancelEvent(e);
	var el=e.target;
	while(el.tagName!='DIV')el=el.parentNode;
	var id=el.kfm_attributes.id;
	if(kfm_lastClicked)$('kfm_file_icon_'+kfm_lastClicked).removeClass('last_clicked');
	if(kfm_lastClicked&&e.shift){
		var e=kfm_lastClicked;
		clearSelections(e);
		kfm_selectNone();
		var a=$('kfm_right_column').fileids,b,c,d;
		for(b=0;b<a.length;++b){
			if(a[b]==e)c=b;
			if(a[b]==id)d=parseInt(b);
		}
		if(c>d){
			b=c;
			c=d;
			d=b;
		}
		for(;c<=d;++c)kfm_addToSelection(a[c]);
	}
	else{
		if(kfm_isFileSelected(id)){
			if(!e.control)kfm_selectNone();
			else kfm_removeFromSelection(id);
		}
		else{
			if(!e.control&&!e.meta)kfm_selectNone();
			kfm_addToSelection(id);
		}
	}
	kfm_lastClicked=id;
	$('kfm_file_icon_'+id).className+=' last_clicked';
}
function kfm_selectSingleFile(id){
	kfm_selectNone();
	kfm_addToSelection(id);
	var panel=$('kfm_right_column'),el=$('kfm_file_icon_'+id);
	var offset=panel.scrollTop,panelHeight=panel.offsetHeight,elTop=getOffset(el,'Top'),elHeight=el.offsetHeight;
	if(elTop+elHeight-offset>panelHeight)panel.scrollTop=elTop-panelHeight+elHeight;
	else if(elTop<offset)panel.scrollTop=elTop;
}
