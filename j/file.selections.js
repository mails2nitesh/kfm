// see license.txt for licensing
function kfm_addToSelection(id){
	selectedFiles.push(id);
	$('kfm_file_icon_'+id).addClass('selected');
	if(kfm_log_level>0)kfm_log(kfm_lang.FileSelected(id));
	kfm_selectionCheck();
}
function kfm_chooseFile(e,o){
	var el=(o?e:getEventTarget(e)).kfm_attributes;
	x_kfm_getFileUrl(el.id,function(url){
		if(kfm_file_handler=='return'||kfm_file_handler=='fckeditor'){
			if(!el.image_data)window.opener.SetUrl(url);
			else window.opener.SetUrl(url.replace(/([^:]\/)\//g,'$1'),0,0,el.image_data.caption);
			window.close();
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
	window.drag_wrapper.setCss('display:block;left:'+(m.x+16)+'px;top:'+m.y+'px');
}
function kfm_file_dragFinish(e){
	clearTimeout(window.dragTrigger);
	if(!window.dragType||window.dragType!=1)return;
	window.dragType=0;
	delEl(['kfm_selection_blocker',window.drag_wrapper]);
	removeEvent(document,'mousemove',kfm_file_drag);
	removeEvent(document,'mouseup',kfm_file_dragFinish);
	var a=kfm_getContainer(getMouseAt(e),getElsWithClass('kfm_directory_link','DIV')),f=[];
	dir_over=a?a.node_id:'.';
	if(dir_over=='.'||dir_over==kfm_cwd_id)return;
	for(var i in selectedFiles){
		f[i]=selectedFiles[i];
		kfm_tracer('kfm_file_icon_'+f[i],'kfm_directory_icon_'+dir_over);
	}
	x_kfm_moveFiles(f,dir_over,kfm_refreshFiles);
	kfm_log(kfm_lang.MovingFilesTo(selectedFiles.join(', '),a.kfm_directoryname));
	kfm_selectNone();
}
function kfm_file_dragStart(filename){
	if(!kfm_isFileSelected(filename))kfm_addToSelection(filename);
	if(!selectedFiles.length)return;
	window.dragType=1;
	var w=getWindowSize();
	document.body.addEl(newEl('div','kfm_selection_blocker').setCss('position:absolute;zIndex:20;left:0;top:0;width:'+w.x+'px;height:'+w.y+'px'));
	window.drag_wrapper=newEl('div','kfm_drag_wrapper').setCss('display:none;opacity:.7');
	for(var i=0;i<10&&i<selectedFiles.length;++i)window.drag_wrapper.addEl([$('kfm_file_icon_'+selectedFiles[i]).kfm_attributes.name,newEl('br')]);
	if(selectedFiles.length>10)window.drag_wrapper.addEl(newEl('i',0,0,'...and '+(selectedFiles.length-10)+' more')); // TODO: New String
	document.body.addEl(window.drag_wrapper);
	addEvent(document,'mousemove',kfm_file_drag);
}
function kfm_isFileSelected(filename){
	return kfm_inArray(selectedFiles,filename);
}
function kfm_removeFromSelection(id){
	var i;
	for(i in selectedFiles){
		if(selectedFiles[i]==id){
			var el=$('kfm_file_icon_'+id);
			if(el)el.delClass('selected');
			kfm_selectionCheck();
			return selectedFiles.splice(i,1);
		}
	}
}
function kfm_selectAll(){
	kfm_selectNone();
	var a,b=$('kfm_right_column').fileids;
	for(a in b)kfm_addToSelection(b[a]);
}
function kfm_selectInvert(){
	var a,b=$('kfm_right_column').fileids;
	for(a in b)if(kfm_isFileSelected(b[a]))kfm_removeFromSelection(b[a]);
	else kfm_addToSelection(b[a]);
}
function kfm_selectNone(){
	if(kfm_lastClicked)$('kfm_file_icon_'+kfm_lastClicked).delClass('last_clicked');
	for(var i=selectedFiles.length;i>-1;--i)kfm_removeFromSelection(selectedFiles[i]);
	kfm_selectionCheck();
}
function kfm_selectionCheck(){
	if(selectedFiles.length==1){
		getElsWithClass('kfm_panel_body','DIV',$('kfm_file_details_panel')).innerHTML='loading';
		kfm_run_delayed('file_details','if(selectedFiles.length==1)x_kfm_getFileDetails(selectedFiles[0],kfm_showFileDetails);');
	}
	else kfm_run_delayed('file_details','if(!selectedFiles.length)kfm_showFileDetails();');
}
function kfm_selection_drag(e){
	if(!window.dragType||window.dragType!=2)return;
	clearSelections();
	var p1=getMouseAt(e),p2=window.drag_wrapper.orig;
	var x1=p1.x>p2.x?p2.x:p1.x;
	var x2=p2.x>p1.x?p2.x:p1.x;
	var y1=p1.y>p2.y?p2.y:p1.y;
	var y2=p2.y>p1.y?p2.y:p1.y;
	window.drag_wrapper.setCss('display:block;left:'+x1+'px;top:'+y1+'px;width:'+(x2-x1)+'px;height:'+(y2-y1)+'px;zIndex:4');
}
function kfm_selection_dragFinish(e){
	clearTimeout(window.dragSelectionTrigger);
	if(!window.dragType||window.dragType!=2)return;
	var p1=getMouseAt(e),p2=window.drag_wrapper.orig;
	var x1=p1.x>p2.x?p2.x:p1.x,x2=p2.x>p1.x?p2.x:p1.x,y1=p1.y>p2.y?p2.y:p1.y,y2=p2.y>p1.y?p2.y:p1.y;
	var offset=$('kfm_right_column').scrollTop;
	if(offset){
		y1+=offset;
		y2+=offset;
	}
	delEl('kfm_selection_blocker');
	setTimeout('window.dragType=0;',1); // pause needed for IE
	delEl(window.drag_wrapper);
	removeEvent(document,'mousemove',kfm_selection_drag);
	removeEvent(document,'mouseup',kfm_selection_dragFinish);
	var fileids=$('kfm_right_column').fileids;
	kfm_selectNone();
	var lastfile=$('kfm_file_icon_'+fileids[fileids.length-1]);
	if(y1>getOffset(lastfile,'Top')+lastfile.offsetHeight)return;
	for(var f in fileids){
		var file=fileids[f],icon=$('kfm_file_icon_'+file);
		var x3=getOffset(icon,'Left'),y3=getOffset(icon,'Top');
		var x4=x3+icon.offsetWidth,y4=y3+icon.offsetHeight;
		if(
			kfm_isPointInBox(x3,y3,x1,y1,x2,y2)||
			kfm_isPointInBox(x4,y3,x1,y1,x2,y2)||
			kfm_isPointInBox(x3,y4,x1,y1,x2,y2)||
			kfm_isPointInBox(x4,y4,x1,y1,x2,y2)||
			kfm_isPointInBox(x1,y1,x3,y3,x4,y4)||
			kfm_isPointInBox(x2,y1,x3,y3,x4,y4)||
			kfm_isPointInBox(x1,y2,x3,y3,x4,y4)||
			kfm_isPointInBox(x2,y2,x3,y3,x4,y4)||
			(x1>=x3&&x2<=x4&&y1<=y3&&y2>=y4)||
			(x1<=x3&&x2>=x4&&y1>=y3&&y2<=y4)
		)kfm_addToSelection(file);
	}
	kfm_selectionCheck();
}
function kfm_selection_dragStart(e){
	if(window.dragType)return;
	window.dragType=2;
	var w=getWindowSize();
	document.body.addEl(newEl('div','kfm_selection_blocker').setCss('position:absolute;zIndex:20;left:0;top:0;width:'+w.x+'px;height:'+w.y+'px'));
	addEvent(document,'mouseup',kfm_selection_dragFinish);
	window.drag_wrapper=newEl('div','kfm_selection_drag_wrapper').setCss('display:none;opacity:.7');
	window.drag_wrapper.orig=window.mouseAt;
	document.body.addEl(window.drag_wrapper);
	addEvent(document,'mousemove',kfm_selection_drag);
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
	kfm_cancelEvent(e);
	var el=getEventTarget(e),id=el.kfm_attributes.id;
	if(kfm_lastClicked&&e.shiftKey){
		clearSelections(e);
		kfm_selectNone();
		var a=$('kfm_right_column').fileids,b,c,d;
		for(b in a){
			if(a[b]==kfm_lastClicked)c=parseInt(b);
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
			if(!e.ctrlKey)kfm_selectNone();
			else kfm_removeFromSelection(id);
		}
		else{
			if(!e.ctrlKey&&!e.metaKey)kfm_selectNone();
			kfm_addToSelection(id);
		}
	}
	if(kfm_lastClicked)$('kfm_file_icon_'+kfm_lastClicked).delClass('last_clicked');
	kfm_lastClicked=id;
	$('kfm_file_icon_'+id).addClass('last_clicked');
}
function kfm_selectSingleFile(id){
	kfm_selectNone();
	kfm_addToSelection(id);
	var panel=$('kfm_right_column'),el=$('kfm_file_icon_'+id);
	var offset=panel.scrollTop,panelHeight=panel.offsetHeight,elTop=getOffset(el,'Top'),elHeight=el.offsetHeight;
	if(elTop+elHeight-offset>panelHeight)panel.scrollTop=elTop-panelHeight+elHeight;
	else if(elTop<offset)panel.scrollTop=elTop;
}
