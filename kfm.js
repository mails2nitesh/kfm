// see license.txt for licensing
function Browser(){
	var ua=navigator.userAgent;
	this.isFirefox=ua.indexOf('Firefox')>=0;
	this.isOpera=ua.indexOf('Opera')>=0;
	this.isIE=ua.indexOf('MSIE')>=0&&!this.isOpera;
	this.isSafari=ua.indexOf('Safari')>=0;
	this.isKonqueror=ua.indexOf('KHTML')>=0&&!this.isSafari;
	this.versionMinor=parseFloat(navigator.appVersion);
	if(this.isIE)this.versionMinor=parseFloat(ua.substring(ua.indexOf('MSIE')+5));
	this.versionMajor=parseInt(this.versionMinor);
}
{ // variables
	if(!window.kfm_callerType)window.kfm_callerType='standalone';
	var browser=new Browser(),loadedScripts=[],kaejax_is_loaded=0,function_urls=[];
	var kfm_cwd_name='',kfm_cwd_id=0,kfm_cwd_subdirs=[],contextmenu=null,selectedFiles=[],kfm_imageExts=['jpg','jpeg','gif','png','bmp'];
	var kfm_filesCache=[],kfm_tracers=[],kfm_tracer_v=10,kfm_lastClicked,kfm_unique_classes=[];
	var kaejax_timeouts=[],kfm_directories=[0,{name:'root',pathname:'/'}];
	var kaejax_replaces={'([89A-F][A-Z0-9])':'%u00$1','22':'"','2C':',','3A':':','5B':'[','5D':']','7B':'{','7D':'}'};
	if(!browser.isIE){
		for(var a in kaejax_replaces){
			kaejax_replaces[kaejax_replaces[a]]=eval('/%'+a+'/g');
			delete kaejax_replaces[a];
		}
	}
}
function kfm(){
	{ // extend language objects
		for(var j in kfm_lang){
			if(/%[1-9]/.test(kfm_lang[j])){
				kfm_lang[j]=(function(str){
					return function(){
						var tmp=str;
						for(var i=1;i<arguments.length+1;++i)tmp=tmp.replace("%"+i,arguments[i-1]);
						return tmp;
					};
				})(kfm_lang[j]);
			}
		}
	}
	{ // add custom functions to all existing elements
		var els=document.getElementsByTagName('*');
		for(var i in els){if(els[i].tagName)kfm_addMethods(els[i])};
	}
	var form_panel,form,iframe,right_column,message, directories,logs,logHeight=64,w=getWindowSize();
	kfm_cwd_name=starttype;
	{ // create left column
		var left_column=kfm_createPanelWrapper('kfm_left_column');
		kfm_addPanel(left_column,'kfm_directories_panel');
		kfm_addPanel(left_column,'kfm_directory_properties_panel');
		kfm_addPanel(left_column,'kfm_logs_panel');
		kfm_addPanel(left_column,'kfm_search_panel');
		left_column.panels_unlocked=1;
		left_column.setCss('height:'+w.y+'px');
		left_column.contextmenu=function(e){
			e=getEvent(e);
			{ // variables
				var row,cell,cells,m=getMouseAt(e),rows=0,target=kfm_getParentEl(getEventTarget(e),'DIV');
//				while(target.tagName!='DIV'&&target)target=target.parentNode;
			}
			{ // add the links
				var links=[],i;
				var l=left_column.panels_unlocked;
				links.push(['javascript:kfm_togglePanelsUnlocked()',l?kfm_lang.LockPanels:kfm_lang.UnlockPanels,l?'lock':'unlock']);
				var ps=left_column.panels;
				for(var i in ps){
					var p=$(ps[i]);
					if(!p.visible)links.push(['javascript:kfm_addPanel("kfm_left_column","'+ps[i]+'")',kfm_lang.ShowPanel(p.title)]);
				}
				kfm_createContextMenu(m,links);
			}
		};
	}
	{ // create right_column
		right_column=newEl('div','kfm_right_column');
		addEvent(right_column,'click',function(){if(!window.dragType)kfm_selectNone()});
		addEvent(right_column,'mousedown',function(e){
			if(e.button==2)return;
			window.mouseAt=getMouseAt(e);
			window.dragSelectionTrigger=setTimeout(function(){kfm_selection_dragStart()},200);
			addEvent(right_column,'mouseup',kfm_selection_dragFinish);
		});
		right_column.contextmenu=function(e){
			var links=[],i;
			links.push(['javascript:kfm_createEmptyFile()',kfm_lang.CreateEmptyFile,'filenew']);
			if(selectedFiles.length!=$('kfm_right_column').fileids.length)links.push(['javascript:kfm_selectAll()',kfm_lang.SelectAll,'ark_selectall']);
			if(selectedFiles.length)links.push(['javascript:kfm_selectNone()',kfm_lang.SelectNone,'']);
			links.push(['javascript:kfm_selectInvert()',kfm_lang.InvertSelection,'']);
			kfm_createContextMenu(getMouseAt(getEvent(e,1)),links);
		};
	}
	{ // create message div
		message=newEl('div','message');
	}
	{ // draw areas to screen and load files and directory info
		document.body.addClass(browser.isIE?'ie':(browser.isFirefox?'firefox':''));
		document.body.empty().addEl([left_column,right_column, message]);
		x_kfm_loadFiles(1,kfm_refreshFiles);
		x_kfm_loadDirectories(1,kfm_refreshDirectories);
	}
	addEvent(document,'keyup',kfm_keyup);
	addEvent(window,'resize',function(){$('kfm_left_column').setCss('height:'+getWindowSize().y+'px');kfm_redrawPanels('kfm_left_column')});
	kfm_contextmenuinit();
}
function kfm_addMethods(el){
	X(el,{
		addCell:function(b,c,d,e){
			var f=kfm_addMethods(this.insertCell(b));
			if(c)f.colSpan=c;
			if(d)f.addEl(d);
			f.setClass(e);
			return f;
		},
		addClass:function(c){
			this.setClass(this.getClass()+' '+c);
		},
		addEl:function(a){
			if(!a)return;
			if(!isArray(a))a=[a];
			for(var i in a){
				if(isArray(a[i]))this.addEl(a[i]);
				else this.appendChild(a[i].toString()===a[i]?newText(a[i]):a[i]);
			}
		},
		addRow:function(p,c){
			var o=this.insertRow(p===parseInt(p)?p:this.rows.length);
			kfm_addMethods(o);
			o.setClass(c);
			return o;
		},
		contextmenu:function(e){},
		delClass:function(n){
			var i,d=[],c=this.getClass().split(" ");
			if(isArray(n)){
				for(i in n)this.delClass(n[i]);
				return;
			}
			for(i in c)if(c[i]!=n)d.push(c[i]);
			this.setClass(d.join(" "));
		},
		empty:function(){
			while(this.childNodes&&this.childNodes.length)delEl(this.childNodes[0]);
			return this;
		},
		getClass:function(){return this.className?this.className:''},
		hasClass:function(c){return new RegExp('(\\s|^)'+c+'(\\s|$)').test(this.className)},
		setClass:function(c,u){
			this.className=c?c:'';
			if(!u)return;
			if(kfm_unique_classes[c])kfm_unique_classes[c].delClass(c);
			kfm_unique_classes[c]=this;
		},
		setCss:function(s){
			var i;
			s=s.split(';');
			for(i in s){
				var p=s[i].split(':');
				var r=p[0],v=p[1];
				if(r=='opacity')setOpacity(this,v);
				else if(r=='float')setFloat(this,v);
				else try{this.style[r]=v}catch(e){kfm_log(kfm_lang.SetStylesError(r,v))}
			}
			return this;
		}
	});
	addEvent(el,'contextmenu',function(e){this.contextmenu(e)});
	return el;
}
function kfm_addPanel(wrapper,panel){
	wrapper=$(wrapper);
	if(kfm_hasPanel(wrapper,panel)){
		$(panel).visible=1;
		kfm_redrawPanels(wrapper);
		return;
	}
	if     (panel=='kfm_directories_panel')el=kfm_createPanel(kfm_lang.Directories,'kfm_directories_panel',newEl('table','kfm_directories'),{state:1});
	else if(panel=='kfm_directory_properties_panel')el=kfm_createPanel(kfm_lang.DirectoryProperties,'kfm_directory_properties_panel',newEl('div','kfm_directory_properties'),{state:0,abilities:1});
	else if(panel=='kfm_file_details_panel')el=kfm_createFileDetailsPanel();
	else if(panel=='kfm_file_upload_panel')el=kfm_createFileUploadPanel();
	else if(panel=='kfm_search_panel')el=kfm_createSearchPanel();
	else if(panel=='kfm_logs_panel')el=kfm_createPanel(kfm_lang.Logs,'kfm_logs_panel',newEl('p',0,0,kfm_lang.LoadingKFM),{state:2,height:60,abilities:1});
	else{
		kfm_log(kfm_lang.NoPanel(panel));
		return;
	}
	wrapper.panels[wrapper.panels.length]=panel;
	wrapper.addEl(el);
}
function kfm_addToSelection(id){
	selectedFiles.push(id);
	$('kfm_file_icon_'+id).addClass('selected');
	if(kfm_log_level>0)kfm_log(kfm_lang.FileSelected(id));
	kfm_selectionCheck();
}
function kfm_cancelEvent(e,c){
	e.stopPropagation();
	if(c)e.preventDefault();
}
function kfm_closeContextMenu(){
	delEl(contextmenu);
	contextmenu=null;
}
function kfm_contextmenuinit(){
	kfm_getWindow().onclick=function(e){
		if(!contextmenu)return;
		var c=contextmenu,m=getMouseAt(e);
		var l=c.offsetLeft,t=c.offsetTop;
		if(m.x<l||m.x>l+c.offsetWidth||m.y<t||m.y>t+c.offsetHeight)kfm_closeContextMenu();
	}
	kfm_getWindow().oncontextmenu=function(e){
		e=getEvent(e);
		kfm_cancelEvent(e,1);
	}
}
function kfm_chooseFile(e,o){
	var el=(o?e:getEventTarget(e)).kfm_attributes;
	var url=document.location.toString().replace(/browser.*/,'get.php?id='+el.id);
	if(kfm_file_handler=='fckeditor'){
		if(!el.image_data)window.opener.SetUrl(url);
		else window.opener.SetUrl(url,0,0,el.image_data.caption);
		window.close();
	}
	else if(kfm_file_handler=='download'){
		url+='&forcedownload=1';
		document.location=url;
	}
}
function kfm_changeCaption(id){
	var el=kfm_filesCache[id],txt=kfm_lang.ChangeCaption+el.image_data.caption;
	var newCaption=kfm_prompt(txt,el.image_data.caption);;
	if(!newCaption||newCaption==el.image_data.caption)return;
	if(confirm(kfm_lang.NewCaptionIsThisCorrect(newCaption))){
		kfm_filesCache[id]=null;
		kfm_log(kfm_lang.log_ChangeCaption(id,newCaption));
		x_kfm_changeCaption(id,newCaption,kfm_refreshFiles);
	}
}
function kfm_changeDirectory(e){
	var el=getEventTarget(e),a,els=getElsWithClass('kfm_directory_open','TD');
	if(browser.isIE)while(el&&!el.node_id)el=el.parentNode;
	kfm_cwd_name=el.kfm_directoryname;
	kfm_cwd_id=el.node_id;
	for(a in els)els[a].delClass('kfm_directory_open');
	el.parentNode.addClass('kfm_directory_open');
	x_kfm_loadFiles(kfm_cwd_id,kfm_refreshFiles);
	x_kfm_loadDirectories(kfm_cwd_id,kfm_refreshDirectories);
}
function kfm_clearMessage(message){
	$('message').setCss('textDecoration:none').innerHTML=message;
	setTimeout('kfm_hideMessage()',5000);
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
}
function kfm_createDirectory(id){
	var newName=kfm_prompt(kfm_lang.CreateDirMessage(kfm_directories[id].pathname),kfm_lang.NewDirectory);
	if(newName&&newName!=''&&!/\/|^\./.test(newName))x_kfm_createDirectory(id,newName,kfm_refreshDirectories);
}
function kfm_createEmptyFile(){
	var filename='newfile.txt',msg='';
	do{
		var not_ok=0;
		filename=kfm_prompt(kfm_lang.WhatFilenameToCreateAs+msg,filename);
		if(!filename)return;
		if(kfm_isFileInCWD(filename)){
			var o=confirm(kfm_lang.AskIfOverwrite(filename));
			if(!o)not_ok=1;
		}
		if(filename.indexOf('/')>-1){
			msg=kfm_lang.NoForwardslash;
			not_ok=1;
		}
	}while(not_ok);
	x_kfm_createEmptyFile(filename,kfm_refreshFiles);
}
function kfm_createFileUploadPanel(){
	{ // create upload form
		var sel=newSelectbox('uploadType',[kfm_lang.Upload,kfm_lang.CopyFromURL],0,0,function(){
			var copy=parseInt(this.selectedIndex);
			$('kfm_uploadForm').setCss('display:'+(copy?'none':'block'));
			$('kfm_copyForm').setCss('display:'+(copy?'block':'none'));
		});
		{ // upload from computer
			var f1=newForm('upload.php','POST','multipart/form-data','kfm_iframe');
			f1.id='kfm_uploadForm';
			var iframe=newEl('iframe','kfm_iframe').setCss('display:none');
			iframe.src='empty';
			var submit=newInput('upload','submit',kfm_lang.Upload);
			var input=newInput('kfm_file','file');
			input.onkeyup=kfm_cancelEvent;
			f1.addEl([input,submit]);
		}
		{ // copy from URL
			var f2=newEl('div','kfm_copyForm');
			f2.setCss('display:none');
			var submit2=newInput('upload','submit',kfm_lang.CopyFromURL);
			var inp2=newInput('kfm_url');
			inp2.setCss('width:100%');
			submit2.onclick=kfm_downloadFileFromUrl;
			f2.addEl([inp2,submit2]);
		}
	}
	return kfm_createPanel(kfm_lang.FileUpload,'kfm_file_upload_panel',[sel,f1,iframe,f2],{maxedState:3});
}
function kfm_createFileDetailsPanel(){
	return kfm_createPanel(kfm_lang.FileDetails,'kfm_file_details_panel',0,{state:1,abilities:1});
}
function kfm_createPanel(title,id,subels,vars){
	// states: 0=minimised,1=maximised,2=fixed-height
	var el=X(newEl('div',id,'kfm_panel',[newEl('div',0,'kfm_panel_header',title),newEl('div',0,'kfm_panel_body',subels)]),{
		state:0,height:0,title:title,abilities:0,visible:1,
		addCloseButton:function(){if(this.abilities&1)this.addButton('removePanel','','x',kfm_lang.Close)},
		addMaxButton:function(){this.addButton('maximisePanel','','M',kfm_lang.Maximise)},
		addMinButton:function(){this.addButton('minimisePanel','','_',kfm_lang.Minimise)},
		addMoveDownButton:function(){if(this.id!=this.parentNode.panels[this.parentNode.panels.length-1])this.addButton('movePanel',',1','d',kfm_lang.MoveDown)},
		addMoveUpButton:function(){if(this.id!=this.parentNode.panels[0])this.addButton('movePanel',',-1','u',kfm_lang.MoveUp)},
		addRestoreButton:function(){this.addButton('restorePanel','','r',kfm_lang.Restore)},
		addButton:function(f,p,b,t){
			getElsWithClass('kfm_panel_header','DIV',this)[0].addEl(
				newLink('javascript:kfm_'+f+'("'+this.parentNode.id+'","'+this.id+'"'+p+')','['+b+']',0,'kfm_panel_header_'+b,t)
			);
		}
	});
	if(vars)el=X(el,vars);
	return el;
}
function kfm_createPanelWrapper(name){
	var el=newEl('div',name,'kfm_panel_wrapper');
	el.panels=[];
	return el;
}
function kfm_createSearchPanel(){
	{ // create upload form
		var t=newEl('table','kfm_search_table');
		var r=t.insertRow(0);
		r.insertCell(0).appendChild(newText(kfm_lang.Search));
		var input=newInput('kfm_search');
		input.onkeyup=kfm_runSearch;
		r.insertCell(1).appendChild(input);
	}
	return kfm_createPanel(kfm_lang.Search,'kfm_search_panel',t,{maxedState:3});
}
function kfm_deleteDirectory(id){
	if(confirm(kfm_lang.DelDirMessage(kfm_directories[id].pathname)))x_kfm_deleteDirectory(id,kfm_deleteDirectoryCheck);
}
function kfm_deleteDirectoryCheck(res){
	if(res.type&&res.type=='error'){
		switch(parseInt(res.msg)){
			case 1: kfm_log('error: '+kfm_lang.IllegalDirectoryName(res.name)); break;
			case 2:{ // not empty
				var ok=confirm(kfm_lang.RecursiveDeleteWarning(res.name));
				if(ok)x_kfm_deleteDirectory(res.id,1,kfm_deleteDirectoryCheck);
				break;
			}
			case 3: kfm_log('error: '+kfm_lang.RmdirFailed(res.name)); break;
			case 4: kfm_log('error: '+kfm_lang.DirectoryNotInDb); break;
			default: alert(res.msg);
		}
	}
	else kfm_refreshDirectories(res);
}
function kfm_deleteFile(id){
	var filename=$('kfm_file_icon_'+id).kfm_attributes.name;
	if(confirm(kfm_lang.DelFileMessage(filename))){
		kfm_filesCache[filename]=null;
		x_kfm_rm(id,kfm_refreshFiles);
	}
}
function kfm_deleteSelectedFiles(){
	if(confirm(kfm_lang.DelMultipleFilesMessage+selectedFiles.join('\n'))){
		for(var i in selectedFiles)kfm_filesCache[selectedFiles[i]]=null;
		x_kfm_rm(selectedFiles,kfm_refreshFiles);
	}
}
function kfm_dir_addLink(t,name,parent_addr,is_last,has_node_control,parent){
	var r=t.addRow(),c,pdir=parent_addr+name,name=(name==''?'root':name),name_text=newEl('span','directory_name_'+parent,0,'0');
	var el=X(newEl('div','kfm_directory_icon_'+parent,'kfm_directory_link '+(kfm_cwd_name==pdir?'':'kfm_directory_open'),name_text),{
		kfm_directoryname:pdir,
		node_id:parent,
		contextmenu:function(e){
			var links=[],i,node_id=this.node_id;
			if(node_id!=1)links.push(['javascript:kfm_deleteDirectory("'+node_id+'")',kfm_lang.DeleteDir,'remove']);
			links.push(['javascript:kfm_createDirectory("'+node_id+'")',kfm_lang.CreateSubDir,'folder_new']);
			kfm_createContextMenu(getMouseAt(getEvent(e)),links);
		}
	}).setCss('cursor:'+(Browser.isIE?'hand':'pointer'));
	r.addCell(0,0,(has_node_control?newLink('javascript:kfm_dir_openNode('+parent+')','[+]','kfm_dir_node_'+parent,'kfm_dir_node_closed'):newEl('span','kfm_dir_node_'+parent,0,' ')),'kfm_dir_lines_'+(is_last?'lastchild':'child'));
	r.addCell(1,0,el,'kfm_dir_name');
	addEvent(el,'click',kfm_changeDirectory);
	if(parent!=1)addEvent(el,'mousedown',(function(id){
		return function(e){
			if(e.button==2)return;
			addEvent(document,'mouseup',kfm_dir_dragFinish);
			clearTimeout(window.dragTrigger);
			window.dragTrigger=setTimeout(function(){
				kfm_dir_dragStart(id);
			},100);
		};
	})(parent));
	{ // fix name width
		var reqHeight=name_text.offsetHeight;
		name_text.innerHTML=name;
		el=name_text;
		el.style.position='absolute';
		if(reqHeight&&el.offsetHeight>reqHeight){
			var filename=name;
			el.title=name;
			do{
				filename=filename.substring(0,filename.length-1);
				el.innerHTML=filename+'[...]';
			}while(el.offsetHeight>reqHeight);
			el.empty().addEl([newEl('span',0,'filename',filename),newEl('span',0,0,'[...]').setCss('color:red;textDecoration:none')]);
		}
		if(!browser.isIE)el.style.position='inherit';
	}
	{ // subdir holder
		r=t.addRow();
		r.addCell(0,0,' ',is_last?0:'kfm_dir_lines_nochild');
		r.addCell(1).id='kfm_directories_subdirs_'+parent;
	}
	return t;
}
function kfm_dir_drag(e){
	if(!window.dragType||window.dragType!=3)return;
	var m=getMouseAt(e);
	clearSelections();
	window.drag_wrapper.setCss('display:block;left:'+(m.x+8)+'px;top:'+m.y+'px');
}
function kfm_dir_dragFinish(e){
	clearTimeout(window.dragTrigger);
	if(!window.dragType||window.dragType!=3)return;
	window.dragType=0;
	removeEvent(document,'mousemove',kfm_dir_drag);
	removeEvent(document,'mouseup',kfm_dir_dragFinish);
	var dir_from=window.drag_wrapper.dir_id;
	delEl(['kfm_selection_blocker',window.drag_wrapper]);
	var a=kfm_getContainer(getMouseAt(e),getElsWithClass('kfm_directory_link','DIV')),f=[];
	dir_to=a?a.node_id:0;
	if(dir_to==0||dir_to==dir_from)return;
	x_kfm_moveDirectory(dir_from,dir_to,kfm_refreshDirectories);
	kfm_selectNone();
}
function kfm_dir_dragStart(pid){
	window.dragType=3;
	var w=getWindowSize();
	document.body.addEl(newEl('div','kfm_selection_blocker').setCss('position:absolute;zIndex:20;left:0;top:0;width:'+w.x+'px;height:'+w.y+'px'));
	window.drag_wrapper=X(newEl('div','kfm_drag_wrapper','directory').setCss('display:none;opacity:.7'),{dir_id:pid});
	window.drag_wrapper.addEl($('kfm_directory_icon_'+pid).kfm_directoryname);
	document.body.addEl(window.drag_wrapper);
	addEvent(document,'mousemove',kfm_dir_drag);
}
function kfm_dir_openNode(dir){
	var node=$('kfm_dir_node_'+dir);
	node.setClass('kfm_dir_node_opened');
	node.href=node.href.replace(/open/,'close');
	$('kfm_directories_subdirs_'+dir).empty().addEl(kfm_lang.Loading);
	x_kfm_loadDirectories(dir,kfm_refreshDirectories);
}
function kfm_dir_closeNode(dir){
	var node=$('kfm_dir_node_'+dir);
	node.setClass('kfm_dir_node_closed');
	node.href=node.href.replace(/close/,'open');
	$('kfm_directories_subdirs_'+dir).empty();
}
function kfm_downloadFileFromUrl(){
	var url=$('kfm_url').value;
	if(url.substring(0,4)!='http'){
		kfm_log(kfm_lang.UrlNotValidLog);
		return;
	}
	var filename=url.replace(/.*\//,''),msg='';
	do{
		var not_ok=0;
		filename=kfm_prompt(kfm_lang.FileSavedAsMessage+msg,filename);
		if(!filename)return;
		if(kfm_isFileInCWD(filename)){
			var o=confirm(kfm_lang.AskIfOverwrite(filename));
			if(!o)not_ok=1;
		}
		if(filename.indexOf('/')>-1){
			msg=kfm_lang.NoForwardslash;
			not_ok=1;
		}
	}while(not_ok);
	x_kfm_downloadFileFromUrl(url,filename,kfm_refreshFiles);
	$('kfm_url').value='';
}
function kfm_editTextFile(id){
	x_kfm_getTextFile(id,kfm_showTextFile);
}
function kfm_extractZippedFile(id){
	x_kfm_extractZippedFile(id,kfm_refreshFiles);
}
function kfm_file_drag(e){
	if(!window.dragType||window.dragType!=1)return;
	var m=getMouseAt(e);
	clearSelections();
	window.drag_wrapper.setCss('display:block;left:'+(m.x+8)+'px;top:'+m.y+'px');
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
	for(var i in selectedFiles)window.drag_wrapper.addEl([$('kfm_file_icon_'+selectedFiles[i]).kfm_attributes.name,newEl('br')]);
	document.body.addEl(window.drag_wrapper);
	addEvent(document,'mousemove',kfm_file_drag);
}
function kfm_getContainer(p,c){
	for(var i in c){
		var a=c[i],x=getOffset(a,'Left'),y=getOffset(a,'Top');
		if(x<p.x&&y<p.y&&x+a.offsetWidth>p.x&&y+a.offsetHeight>p.y)return a;
	}
}
function kfm_getParentEl(c,t){
	while(c.tagName!=t&&c)c=c.parentNode;
	return c;
}
function kfm_getWindow(){
	return window;
}
function kfm_hasPanel(wrapper,panel){
	for(var i in wrapper.panels)if(wrapper.panels[i]==panel)return true;
	return false;
}
function kfm_hideMessage(){
	$('message').setCss('display:none');
}
function kfm_inArray(haystack,needle){
	var i;
	for(i in haystack)if(haystack[i]==needle)return true;
	return false;
}
function kfm_isFileInCWD(filename){
	var i,files=$('kfm_right_column').fileids;
	for(i in files)if(files[i]==filename)return true;
	return false;
}
function kfm_isFileSelected(filename){
	return kfm_inArray(selectedFiles,filename);
}
function kfm_isPointInBox(x1,y1,x2,y2,x3,y3){
	return(x1>=x2&&x1<=x3&&y1>=y2&&y1<=y3);
}
function kfm_keyup(e){
	var key=browser.isIE?e.keyCode:e.which;
	switch(key){
		case 13:{ // enter
			if(!selectedFiles.length||window.inPrompt)return;
			if(selectedFiles.length>1)return kfm_log(kfm_lang.NotMoreThanOneFile);
			kfm_chooseFile($('kfm_file_icon_'+selectedFiles[0]),1);
			break;
		}
		case 27:{ // escape
			if(!window.inPrompt&&confirm(kfm_lang.AreYouSureYouWantToCloseKFM))window.close();
			break;
		}
		case 37:{ // left arrow
			kfm_shiftFileSelectionLR(-1);
			break;
		}
		case 38:{ // up arrow
			kfm_shiftFileSelectionUD(-1);
			break;
		}
		case 39:{ // right arrow
			kfm_shiftFileSelectionLR(1);
			break;
		}
		case 40:{ // down right arrow
			kfm_shiftFileSelectionUD(1);
			break;
		}
		case 46:{ // delete
			if(!selectedFiles.length)return;
			if(selectedFiles.length>1)kfm_deleteSelectedFiles();
			else kfm_deleteFile(selectedFiles[0]);
			break;
		}
		case 65:{ // a
			if(e.ctrlKey){
				clearSelections(e);
				kfm_selectAll();
			}
			break;
		}
		case 85:{ // u
			if(e.ctrlKey){
				clearSelections(e);
				kfm_selectNone();
			}
			break;
		}
		case 113:{ // f2
			if(!selectedFiles.length)return alert(kfm_lang.PleaseSelectFileBeforeRename);
			if(selectedFiles.length==1){
				kfm_renameFile(selectedFiles[0]);
			}
			else alert(kfm_lang.RenameOnlyOneFile);
		}
	}
}
function kfm_log(msg){
	var wrapper=$('kfm_logs_panel');
	if(!wrapper){
		if(msg.indexOf(kfm_lang.ErrorPrefix)!=0)return;
		kfm_addPanel('kfm_left_column','kfm_logs_panel');
		kfm_redrawPanels('kfm_left_column');
		wrapper=$('kfm_logs_panel');
	}
	wrapper.visible=1;
	var el=getElsWithClass('kfm_panel_body','DIV',$('kfm_logs_panel'))[0],p=newEl('p',0,0,msg);
	if(msg.indexOf(kfm_lang.ErrorPrefix)==0)p.setCss('background:#ff0;fontWeight:bold;color:red');
	el.addEl(p);
	el.scrollTop=el.scrollTop+p.offsetHeight;
}
function kfm_minimisePanel(wrapper,panel){
	$(panel).state=0;
	kfm_redrawPanels($(wrapper));
}
function kfm_maximisePanel(wrapper,panel){
	wrapper=$(wrapper);
	var p=$(panel);
	p.state=p.maxedState==3?3:1;
	kfm_redrawPanels($(wrapper));
}
function kfm_movePanel(wrapper,panel,offset){
	wrapper=$(wrapper);
	var i=0,j,k;
	for(;i<wrapper.panels.length;++i)if(wrapper.panels[i]==panel)j=i;
	if(offset<0)--j;
	k=wrapper.panels[j];
	wrapper.panels[j]=wrapper.panels[j+1];
	wrapper.panels[j+1]=k;
	wrapper.insertBefore($(wrapper.panels[j]),$(wrapper.panels[j+1]));
	kfm_redrawPanels(wrapper);
}
function kfm_redrawPanels(wrapper){
	wrapper=$(wrapper);
	var ps=wrapper.panels,i,minheight=0;
	var minimised=[],maximised=[],fixed_height=[],fixed_height_maxed=[];
	for(i in ps){
		var el=$(ps[i]);
		if(el.visible){
			el.minheight=getElsWithClass('kfm_panel_header','DIV',el.setCss('display:block'))[0].offsetHeight;
			minheight+=el.minheight;
			switch(el.state){
				case 0: minimised[minimised.length]=ps[i]; break;
				case 1: maximised[maximised.length]=ps[i]; break;
				case 2: fixed_height[fixed_height.length]=ps[i]; break;
				case 3: fixed_height_maxed[fixed_height_maxed.length]=ps[i]; break;
				default: kfm_log(kfm_lang.UnknownPanelState+el.state);
			}
		}
		else el.setCss('display:none');
	}
	var height=wrapper.offsetHeight;
	for(i in minimised){
		var n=minimised[i];
		var el=$(n);
		getElsWithClass('kfm_panel_body','DIV',el)[0].setCss('display:none');
		var head=getElsWithClass('kfm_panel_header','DIV',el)[0].empty(),els=[];
		if(wrapper.panels_unlocked){
			el.addCloseButton();
			el.addMaxButton();
			el.addMoveDownButton();
			el.addMoveUpButton();
		}
		els[els.length]=el.title;
		head.addEl(els);
	}
	for(i in fixed_height){
		var n=fixed_height[i];
		var el=$(n)
		getElsWithClass('kfm_panel_body','DIV',el)[0].setCss('height:'+el.height+'px;display:block');
		minheight+=el.height;
		var head=getElsWithClass('kfm_panel_header','DIV',el)[0].empty(),els=[];
		if(wrapper.panels_unlocked){
			el.addCloseButton();
			el.addMaxButton();
			el.addMinButton();
			el.addMoveDownButton();
			el.addMoveUpButton();
		}
		els[els.length]=el.title;
		head.addEl(els);
	}
	for(i in fixed_height_maxed){
		var n=fixed_height_maxed[i];
		var el=$(n),body=getElsWithClass('kfm_panel_body','DIV',el)[0].setCss('height:auto;display:block');
		minheight+=body.offsetHeight;
		var head=getElsWithClass('kfm_panel_header','DIV',el)[0].empty(),els=[];
		if(wrapper.panels_unlocked){
			el.addCloseButton();
			el.addMinButton();
			el.addMoveDownButton();
			el.addMoveUpButton();
		}
		els[els.length]=el.title;
		head.addEl(els);
	}
	if(maximised.length)var size=(height-minheight)/maximised.length;
	for(i in maximised){
		var n=maximised[i];
		var el=$(n)
		getElsWithClass('kfm_panel_body','DIV',el)[0].setCss('height:'+size+'px;display:block');
		var head=getElsWithClass('kfm_panel_header','DIV',el)[0].empty(),els=[];
		if(wrapper.panels_unlocked){
			el.addCloseButton();
			el.addRestoreButton();
			el.addMinButton();
			el.addMoveDownButton();
			el.addMoveUpButton();
		}
		els[els.length]=el.title;
		head.addEl(els);
	}
}
function kfm_refreshDirectories(res){
	if(res.toString()===res)return kfm_log(res);
	var d=res.parent,directories=[];
	if(d==1){
		var p=$('kfm_directories');
		p.parentNode.replaceChild(kfm_dir_addLink(newEl('table','kfm_directories'),'','',1,0,1),p);
	}
	dirwrapper=$('kfm_directories_subdirs_'+d);
	var t=newEl('table'),r,c,l,n='kfm_dir_node_'+d,ln=0;
	for(a in res.directories)ln++;
	dirwrapper.empty().addEl(t);
	for(a in res.directories){
		kfm_dir_addLink(t,res.directories[a][0],res.reqdir,l=(a==ln-1),res.directories[a][1],res.directories[a][2]);
		kfm_directories[res.directories[a][2]]={name:res.directories[a][0],pathname:res.reqdir+res.directories[a][0]};
	}
	if(d!='')$(n).parentNode.empty().addEl(ln?newLink('javascript:kfm_dir_closeNode("'+res.parent+'")','[-]',n,'kfm_dir_node_open'):newEl('span',n,0,' '));
	kfm_cwd_subdirs[d]=res.directories;
	if(!kfm_cwd_subdirs[d]){
		kfm_dir_openNode(res.parent);
	}
	kfm_setDirectoryProperties(res.properties);
	kfm_selectNone();
	kfm_log(kfm_lang.DirRefreshed);
}
function kfm_refreshFiles(res){
	if(res.toString()===res)return kfm_log(res);
	var files=[],a,b,fileids=[],wrapper=$('kfm_right_column').empty();
	wrapper.addEl(newEl('div',0,'kfm_panel_header',kfm_lang.CurrentWorkingDir(res.reqdir)));
	for(a in res.files){
		var name=res.files[a].name,ext=name.replace(/.*\./,''),el,b,fullfilename=kfm_cwd_name+'/'+name,id=res.files[a].id;
		el=newEl('div','kfm_file_icon_'+id,'kfm_file_icon kfm_icontype_'+ext,newEl('span',0,'filename',name)).setCss('cursor:'+(Browser.isIE?'hand':'pointer'));
		addEvent(el,'click',kfm_toggleSelectedFile);
		addEvent(el,'dblclick',kfm_chooseFile);
		el.contextmenu=function(e){
			e=getEvent(e);
			{ // variables
				var name=this.kfm_attributes.name,links=[],i,id=this.kfm_attributes.id;
				var extension=name.replace(/.*\./,'').toLowerCase();
			}
			{ // add the links
				if(selectedFiles.length>1)links.push(['javascript:kfm_deleteSelectedFiles()',kfm_lang.DeleteFile,'remove']);
				else{
					links.push(['javascript:kfm_deleteFile('+id+')',kfm_lang.DeleteFile,'remove']);
					links.push(['javascript:kfm_renameFile('+id+')',kfm_lang.RenameFile,'edit']);
					if(this.kfm_attributes.image_data){
						links.push(['javascript:kfm_rotateImage('+id+',270)',kfm_lang.RotateClockwise,'rotate_cw']);
						links.push(['javascript:kfm_rotateImage('+id+',90)',kfm_lang.RotateAntiClockwise,'rotate_ccw']);
						links.push(['javascript:kfm_resizeImage('+id+')',kfm_lang.ResizeImage,'']);
						links.push(['javascript:kfm_changeCaption('+id+')',kfm_lang.ChangeCaption,'edit']);
					}
					if(kfm_inArray(['zip'],extension))links.push(['javascript:kfm_extractZippedFile("'+id+'")',kfm_lang.ExtractZippedFile,'']);
					if(kfm_inArray(viewable_extensions,extension))links.push(['javascript:x_kfm_viewTextFile('+id+',kfm_viewTextFile)','view','edit']);
					if(kfm_inArray(editable_extensions,extension))links.push(['javascript:kfm_editTextFile("'+id+'")',kfm_lang.EditTextFile,'edit']);
				}
				kfm_createContextMenu(getMouseAt(getEvent(e)),links);
			}
		}
		addEvent(el,'mousedown',(function(id){
			return function(e){
				if(e.button==2)return;
				addEvent(document,'mouseup',kfm_file_dragFinish);
				clearTimeout(window.dragSelectionTrigger);
				window.dragTrigger=setTimeout(function(){
					kfm_file_dragStart(id);
				},100);
			};
		})(id));
		if(kfm_filesCache[id]){
			el.kfm_attributes=kfm_filesCache[id];
			if(kfm_filesCache[id].image_data)kfm_showIcon([id,kfm_filesCache[id].image_data],el);
		}
		else{
			el.kfm_attributes=res.files[a];
			for(b in kfm_imageExts)if(kfm_imageExts[b]==ext)x_kfm_getThumbnail(id,64,64,kfm_showIcon);
		}
		files[a]=el;
		fileids[a]=id;
		wrapper.addEl(el);
		var reqWidth=el.offsetWidth;
		el.style.width='auto';
		if(el.offsetWidth>reqWidth){
			if(name.indexOf('.')>-1){
				var extension=name.replace(/.*\.([^.]*)$/,'$1');
				var filename=name.replace(/\.[^.]*$/,'')+'.';
			}
			else{
				var extension='';
				var filename=name;
			}
			el.title=name;
			var name=el.getElementsByTagName('span')[0];
			name.delClass('filename');
			do{
				filename=filename.substring(0,filename.length-1);
				name.innerHTML=filename+'[...]'+extension;
			}while(el.offsetWidth>reqWidth);
			name.empty().addEl([newEl('span',0,'filename',filename),newEl('span',0,0,'[...]').setCss('color:red;textDecoration:none'),newEl('span',0,'filename',extension)]);
		}
		el.style.width=reqWidth;
		el.style.width=reqWidth-(el.offsetWidth-reqWidth);
	}
	wrapper.fileids=fileids;
	if(!files.length)wrapper.addEl(newEl('span',0,'kfm_empty',kfm_lang.DirEmpty(res.reqdir)));
	document.title=res.reqdir;
	kfm_lastClicked=null;
	kfm_log(kfm_lang.FilesRefreshed);
	if(res.uploads_allowed)kfm_addPanel('kfm_left_column','kfm_file_upload_panel');
	else kfm_removePanel('kfm_left_column','kfm_file_upload_panel');
	kfm_redrawPanels('kfm_left_column');
}
function kfm_removePanel(wrapper,panel){
	var panel=$(panel);
	if(!panel)return;
	$(panel).visible=0;
	kfm_redrawPanels(wrapper);
}
function kfm_renameFile(filename){
	var newName=kfm_prompt(kfm_lang.RenameFileToWhat(filename),filename);
	if(newName&&newName!=''&&newName!=filename){
		kfm_filesCache[filename]=null;
		kfm_log(kfm_lang.RenamedFile(filename,newName));
		x_kfm_renameFile(filename,newName,kfm_refreshFiles);
	}
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
function kfm_resizeImage(id){
	var el=kfm_filesCache[id],txt=kfm_lang.CurrentSize(el.image_data.width,el.image_data.height);
	var x=parseInt(kfm_prompt(txt+kfm_lang.NewWidth,el.image_data.width));
	if(!x)return;
	txt+=kfm_lang.NewWidthConfirmTxt(x);
	var y=parseInt(kfm_prompt(txt+kfm_lang.NewHeight,Math.ceil(el.image_data.height*(x/el.image_data.width))));
	if(!y)return;
	if(confirm(txt+kfm_lang.NewHeightConfirmTxt(y))){
		kfm_filesCache[id]=null;
		x_kfm_resizeImage(id,x,y,kfm_refreshFiles);
	}
}
function kfm_restorePanel(wrapper,panel){
	wrapper=$(wrapper);
	var p=$(panel);
	p.state=2;
	if(!p.height)p.height=getElsWithClass('kfm_panel_body','DIV',p)[0].offsetHeight;
	kfm_redrawPanels(wrapper);
}
function kfm_rotateImage(filename,direction){
	kfm_filesCache[filename]=null;
	x_kfm_rotateImage(filename,direction,kfm_refreshFiles);
}
function kfm_run_delayed(name,call){
	name=name+'_timeout';
	if(window[name])clearTimeout(window[name]);
	window[name]=setTimeout(call,500);
}
function kfm_runSearch(){
	kfm_run_delayed('search','x_kfm_search("'+$('kfm_search').value+'",kfm_refreshFiles)');
}
function kfm_prompt(txt,val){
	window.inPrompt=1;
	var newVal=prompt(txt,val?val:'');
	setTimeout('window.inPrompt=0',1);
	return newVal;
}
function kfm_sanitise_ajax(d){
	var r=kaejax_replaces;
	for(var a in r)d=d.replace(r[a],a);
	return d;
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
}
function kfm_selectionCheck(){
	if(selectedFiles.length==1)kfm_showFileDetailsPanel();
	else kfm_showFileDetails();
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
	delEl('kfm_selection_blocker');
	setTimeout('window.dragType=0;',1); // pause needed for IE
	delEl(window.drag_wrapper);
	removeEvent(document,'mousemove',kfm_selection_drag);
	removeEvent(document,'mouseup',kfm_selection_dragFinish);
	var fileids=$('kfm_right_column').fileids,counted=0;
	kfm_selectNone();
	var lastfile=$('kfm_file_icon_'+fileids[fileids.length-1]);
	if(y1>getOffset(lastfile,'Top')+lastfile.offsetHeight)return;
	for(var f in fileids){
		var file=fileids[f],icon=$('kfm_file_icon_'+file);
		var x3=getOffset(icon,'Left'),y3=getOffset(icon,'Top');
		var x4=x3+icon.offsetWidth,y4=y3+icon.offsetHeight;
		counted++;
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
		window.status=counted;
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
function kfm_setDirectoryProperties(properties){
	if(!$('kfm_directory_properties'))return;
	var wrapper=$('kfm_directory_properties').empty();
	wrapper.properties=properties;
	var table=newEl('table'),row,cell,i;
	{ // directory name
		i=properties.allowed_file_extensions.length?properties.allowed_file_extensions.join(', '):kfm_lang.NoRestrictions;
		row=table.addRow();
		row.addCell(0,0,newEl('strong',0,0,kfm_lang.Name));
		row.addCell(1,0,'/'+kfm_cwd_name);
	}
	{ // allowed file extensions
		i=properties.allowed_file_extensions.length?properties.allowed_file_extensions.join(', '):kfm_lang.NoRestrictions;
		row=table.addRow();
		row.addCell(0,0,newEl('strong',0,0,kfm_lang.AllowedFileExtensions));
		row.addCell(1,0,i);
	}
	wrapper.addEl(table);
}
function kfm_setMessage(message){
	var m=$('message').setCss('display:block;textDecoration:blink').innerHTML=message;
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
	kfm_selectNone();
	kfm_addToSelection(na[a+dir]);
}
function kfm_shiftFileSelectionUD(dir){
	if(selectedFiles.length>1)return;
	var na=$('kfm_right_column').fileids,a=0,ns=na.length;
	if(selectedFiles.length){
		for(;a<ns;++a)if(na[a]==selectedFiles[0])break;
		if(dir==-1){ // up
			if(!a)return;
			var t=$('kfm_file_icon_'+na[a]).offsetTop;
			for(var i=a-1;i;--i){
				var t2=$('kfm_file_icon_'+na[i]).offsetTop;
				if(t2==t)continue;
				break;
			}
			a=i;
		}
		else{
			if(a==ns-1)return;
			var t=$('kfm_file_icon_'+na[a]).offsetTop;
			for(var i=a+1;i<ns-1;++i){
				var t2=$('kfm_file_icon_'+na[i]).offsetTop;
				if(t2==t)continue;
				break;
			}
			a=i;
		}
	}
	else a=dir>0?0:ns-1;
	kfm_selectNone();
	kfm_addToSelection(na[a]);
}
function kfm_showFileDetails(res){
	var fd=$('kfm_file_details_panel');
	if(!fd)kfm_addPanel('kfm_left_column','kfm_file_details_panel');
	var body=getElsWithClass('kfm_panel_body','DIV',$('kfm_file_details_panel'))[0].empty();
	if(!res)return;
	var table=newEl('table'),r;
	{ // filename
		r=table.addRow();
		r.addCell(0,0,newEl('strong',0,0,kfm_lang.Filename));
		r.addCell(1,0,res.filename);
	}
	{ // filesize
		r=table.addRow();
		r.addCell(0,0,newEl('strong',0,0,kfm_lang.Filesize));
		r.addCell(1,0,res.filesize);
	}
	{ // mimetype
		r=table.addRow();
		r.addCell(0).addEl(newEl('strong',0,0,kfm_lang.Mimetype));
		r.addCell(1).addEl(res.mimetype);
	}
	switch(res.mimetype.replace(/\/.*/,'')){
		case 'image':{
			{ // caption
				r=table.addRow();
				r.addCell(0,0,newEl('strong',0,0,kfm_lang.Caption));
				r.addCell(1).innerHTML=(res.caption).replace(/\n/g,'<br \/>');
			}
			break;
		}
	}
	body.addEl(table);
}
function kfm_showFileDetailsPanel(){
	var el=$('kfm_left_column');
	kfm_addPanel(el,'kfm_file_details_panel');
	kfm_redrawPanels(el);
	getElsWithClass('kfm_panel_body','DIV',$('kfm_file_details_panel'))[0].addEl(kfm_lang.Loading);
	x_kfm_getFileDetails(selectedFiles[0],kfm_showFileDetails);
}
function kfm_showIcon(res,el2){
	if(!isArray(res)){
		if(res)kfm_log(res);
		return;
	}
	var file=res[0],image_data=res[1];
	var el=(el2&&!isArray(el2))?el2:$('kfm_file_icon_'+file);
	if(!el||!image_data)return;
	if(image_data.caption)el.title=image_data.caption.replace(/\n/g,' ');
	if(image_data.icon){
		if(!kfm_filesCache[file])image_data.icon=image_data.icon+'?'+Math.random();
		var img=newImg(image_data.icon).setCss('width:1px;height:1px');
		img.onload=function(){
			var p=this.parentNode;
			p.setCss('backgroundImage:url("'+p.kfm_attributes.image_data.icon+'")');
			delEl(this);
		}
		el.addEl(img);
		el.kfm_attributes.image_data=image_data;
		kfm_filesCache[file]=el.kfm_attributes;
	}
}
function kfm_showTextFile(res){
	var t=newEl('table','kfm_editFileTable').setCss('height:100%;width:100%');
	var r2=t.addRow();
	r2.addCell(0,1,res.name);
	r2.addCell(1,1,newLink('javascript:x_kfm_viewTextFile('+res.id+',kfm_viewTextFile)','View',0,'button'));
	r2.addCell(2,1,newLink('javascript:if(confirm(kfm_lang.SaveThenCloseQuestion)){kfm_setMessage("saving file...");x_kfm_saveTextFile('+res.id+',$("kfm_textfile").value,kfm_clearMessage);}','Save',0,'button'));
	r2.addCell(3,1,newLink('javascript:if(confirm(kfm_lang.CloseWithoutSavingQuestion))x_kfm_loadFiles(kfm_cwd_id,kfm_refreshFiles);',kfm_lang.CloseWithoutSaving,0,'button'));
	t.addRow().setCss('height:100%').addCell(0,4,newInput('kfm_textfile','textarea',res.content,'kfm_textfile').setCss('width:100%;height:100%'));
	$('kfm_right_column').empty().addEl(t);
}
function kfm_togglePanelsUnlocked(){
	$('kfm_left_column').panels_unlocked=1-$('kfm_left_column').panels_unlocked;
	kfm_redrawPanels('kfm_left_column');
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
	if(selectedFiles.length==1)kfm_showFileDetailsPanel();
}
function kfm_tracer(f,t){
	var ef=$(f),et=$(t);
	if(!ef||!et)return;
	var wf=ef.offsetWidth,hf=ef.offsetHeight,wt=et.offsetWidth,ht=et.offsetHeight;
	var xf=getOffset(ef,'Left')+(wf/2),yf=getOffset(ef,'Top')+(hf/2),xt=getOffset(et,'Left')+(wt/2),yt=getOffset(et,'Top')+(ht/2);
	var d=Math.sqrt((xf-xt)*(xf-xt)+(yf-yt)*(yf-yt));
	if(d<5)return;
	var i=kfm_tracers.length;
	kfm_tracers[i]={
		x:xf,y:yf,width:wf,height:hf,opacity:.8,xSpeed:(xt-xf)/d,
		ySpeed:(yt-yf)/d,widthReductionSpeed:wf/d,heightReductionSpeed:hf/d,opacityReductionSpeed:.5/d
	}
	setTimeout('kfm_tracerStep('+i+')',40);
}
function kfm_tracerStep(id){
	var el=$('kfm_tracer'+id);
	if(!el){
		el=newEl('div','kfm_tracer'+id,'boxdroptracer');
		document.body.addEl(el);
	}
	kfm_tracers[id].x+=kfm_tracers[id].xSpeed*kfm_tracer_v;
	kfm_tracers[id].y+=kfm_tracers[id].ySpeed*kfm_tracer_v;
	kfm_tracers[id].width-=kfm_tracers[id].widthReductionSpeed*kfm_tracer_v;
	kfm_tracers[id].height-=kfm_tracers[id].heightReductionSpeed*kfm_tracer_v;
	kfm_tracers[id].opacity-=kfm_tracers[id].opacityReductionSpeed*kfm_tracer_v;
	if(kfm_tracers[id].width<1 && kfm_tracers[id].height<1){
		delEl(el);
		kfm_tracers[id]=null;
		return;
	}
	el.setCss('opacity:'+kfm_tracers[id].opacity+';width:'+kfm_tracers[id].width+'px;height:'+kfm_tracers[id].height+'px;left:'+parseInt(kfm_tracers[id].x-kfm_tracers[id].width/2)+'px;top:'+parseInt(kfm_tracers[id].y-kfm_tracers[id].height/2)+'px');
	setTimeout("kfm_tracerStep("+id+")",25);
}
function kfm_viewTextFile(res){
	var t=newEl('table','kfm_viewFileTable').setCss('height:100%;width:100%');
	var r=t.addRow(),c=0,wrapper=newEl('div').setCss('overflow:auto;width:100%;height:100%');
	r.addCell(c++,1,res.name);
	if(res.buttons_to_show&2)r.addCell(c++,1,newLink('javascript:kfm_editTextFile('+res.id+')','Edit',0,'button'));
	if(res.buttons_to_show&1)r.addCell(c++,1,newLink('javascript:x_kfm_loadFiles(kfm_cwd_id,kfm_refreshFiles);',kfm_lang.Close,0,'button'));
	var cell=t.addRow().setCss('height:100%;').addCell(0,c).addEl(wrapper);
	wrapper.innerHTML=res.content;
	$('kfm_right_column').empty().addEl(t);
}

function $(){
	var x=arguments,i,e,a=[];
	for(i=0;i<x.length;++i){
		e=x[i];
		if(typeof e=='string')e=document.getElementById(e);
		if(x.length==1)return e;
		a.push(e);
	}
	return a;
}
if(browser.isIE){
	window.addEvent=function addEvent(o,t,f){
		o['e'+t+f]=f;
		o[t+f]=function(){o['e'+t+f](window.event)}
		o.attachEvent('on'+t,o[t+f]);
	};
}
else{
	window.addEvent=function addEvent(o,t,f) {
		o.addEventListener(t,f,false);
	};
}
function clearSelections(){
	window.getSelection().removeAllRanges();
}
function delEl(o){
	var i;
	if(isArray(o))for(i in o)delEl(o[i]);
	else{
		o=$(o);
		if(o&&o.parentNode)o.parentNode.removeChild(o);
	}
}
function getEls(i,p){
	return p?p.getElementsByTagName(i):document.getElementsByTagName(i);
}
function getElsWithClass(c,t,p){
	var r=[],els=getEls(t,p),i;
	for(i in els)if(els[i].hasClass&&els[i].hasClass(c))r.push(els[i]);
	return r;
}
function getEvent(e){
	return e?e:(window.event?window.event:"");
}
function getEventTarget(e){
	return getEvent(e).currentTarget;
}
function getMouseAt(e){
	e=getEvent(e);
	var m=getWindowScrollAt();
	m.x+=e.clientX;
	m.y+=e.clientY;
	return m;
}
function getOffset(el,s) {
	var n=parseInt(el['offset'+s]),p=el.offsetParent;
	if(p)n+=getOffset(p,s);
	return n;
}
function getWindowScrollAt(){
	return {x:window.pageXOffset,y:window.pageYOffset};
}
function getWindowSize(){
	return {x:window.innerWidth,y:window.innerHeight};
}
function isArray(o){
	return o instanceof Array||typeof o=='array';
}
function kaejax_create_functions(url,f){
	kaejax_is_loaded=1;
	for(i in f){
		eval('window.x_'+f[i]+'=function(){kaejax_do_call("'+f[i]+'",arguments)}');
		function_urls[f[i]]=url;
	}
}
function kaejax_do_call(func_name,args){
	var uri=function_urls[func_name];
	if(!window.kaejax_timeouts[uri])window.kaejax_timeouts[uri]={t:setTimeout('kaejax_sendRequests("'+uri+'")',1),c:[]};
	var l=window.kaejax_timeouts[uri].c.length,v2=[];
	for(var i=0;i<args.length-1;++i)v2[v2.length]=args[i]
	window.kaejax_timeouts[uri].c[l]={f:func_name,c:args[args.length-1],v:v2};
}
function kaejax_sendRequests(uri){
	var t=window.kaejax_timeouts[uri];
	window.kaejax_timeouts[uri]=null;
	var x=new XMLHttpRequest(),post_data="kaejax="+escape(json.s.object(t)).replace(/%([89A-F][A-Z0-9])/g,'%u00$1');
	post_data=kfm_sanitise_ajax(post_data);
	x.open('POST',uri,true);
	x.setRequestHeader("Method","POST "+uri+" HTTP/1.1");
	x.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	x.onreadystatechange=function(){
		if(x.readyState!=4)return;
		var r=x.responseText;
		if(r.substring(0,5)=='error')return alert(r);
		var v=eval('('+unescape(r)+')');
		for(var i=0;i<t.c.length;++i){
			var f=t.c[i].c,p=[];
			if(isArray(f)){
				p=f;
				f=f[0];
			}
			f(v[i],p);
		}
	}
	x.send(post_data);
}
function loadJS(url){
	var i;
	for(i in loadedScripts)if(loadedScripts[i]==url)return 0;
	loadedScripts.push(url);
	var el=newEl('script');
	el.type="text/javascript";
	if(kaejax_is_loaded&&/\.php/.test(url))url+=(/\?/.test(url)?'&':'?')+'kaejax_is_loaded';
	el.src=url;
	getEls('head')[0].appendChild(el);
	return 1;
}
function newEl(t,id,cn,chld){
	var el=document.createElement(t);
	if(t=='iframe')el.src='/i/blank.gif';
	if(id){
		el.id=id;
		el.name=id;
	}
	kfm_addMethods(el);
	el.addEl(chld);
	el.setClass(cn);
	return el;
}
function newForm(action,method,enctype,target){
	var el=newEl('form');
	el.action=action;
	el.method=method;
	el.enctype=enctype;
	el.target=target;
	return el;
}
function newImg(a){
	var b=newEl('img');
	b.src=a;
	return b;
}
function newInput(n,t,v,cl){
	var b;
	if(!t)t='text';
	switch(t){
		case 'checkbox':{
			b=newEl('input',n);
			b.type='checkbox';
			b.style.width='auto';
			break;
		}
		case 'textarea':{
			b=newEl('textarea',n);
			break;
		}
		default:{
			b=newEl('input',n);
			b.type=t;
		}
	}
	if(v){
		if(t=='checkbox'){
			b.checked='checked';
			b.defaultChecked='checked';
		}
		else if(t!='datetime')b.value=v;
	}
	b.setClass(cl);
	return b;
}
function newLink(h,t,id,c,title){
	if(!title)title='';
	var a=newEl('a',id,c,t);
	X(a,{href:h,title:title});
	return a;
}
function newSelectbox(name,keys,vals,s,f){
	var el2=newEl('select',name),el3,s2=0,i;
	if(!s)s=0;
	if(!vals)vals=keys;
	for(i in vals){
		var v1=vals[i].toString();
		var v2=v1.length>20?v1.substr(0,27)+'...':v1;
		el3=X(newEl('option',0,0,v2),{value:keys[i],title:v1});
		if(keys[i]==s)s2=i;
		el2.addEl(el3);
	}
	el2.selectedIndex=s2;
	if(f)el2.onchange=f;
	return el2;
}
function newText(a){
	return document.createTextNode(a);
}
function removeEvent(o,t,f){
	if(o&&o.removeEventListener)o.removeEventListener(t,f,false);
}
function setFloat(e,f){
	e.style.cssFloat=f;
}
function setOpacity(e,o){
	e.style.opacity=o;
}
function X(d,s){
	for(var p in s)d[p]=s[p];
	return d;
}
if(browser.isIE)loadJS('j/ie.js');
if(browser.isKonqueror)loadJS('j/konqueror.js');
var json={
	m:{
		'\b': '\\b',
		'\t': '\\t',
		'\n': '\\n',
		'\f': '\\f',
		'\r': '\\r',
		'"' : '\\"',
		'\\': '\\\\'
	},
	s:{
		array: function (x) {
			var a = ['['], b, f, i, l = x.length, v;
			for (i = 0; i < l; i += 1) {
				v = x[i];
				f = json.s[typeof v];
				if (f) {
					v = f(v);
					if (typeof v == 'string') {
						if (b) {
							a[a.length] = ',';
						}
						a[a.length] = v;
						b = true;
					}
				}
			}
			a[a.length] = ']';
			return a.join('');
		},
		'boolean': function (x) {
			return String(x);
		},
		'null': function (x) {
			return "null";
		},
		number: function (x) {
			return isFinite(x) ? String(x) : 'null';
		},
		object: function (x) {
			if (x&&!x.tagName) {
				if(x instanceof Array)return json.s.array(x);
				var a = ['{'], b, f, i, v;
				for (i in x) {
					v = x[i];
					f = json.s[typeof v];
					if (f) {
						v = f(v);
						if (typeof v == 'string') {
							if (b) {
								a[a.length] = ',';
							}
							a.push(json.s.string(i), ':', v);
							b = true;
						}
					}
				}
				a[a.length] = '}';
				return a.join('');
			}
			return 'null';
		},
		string: function (x) {
			if (/["\\\x00-\x1f]/.test(x)) {
				x = x.replace(/([\x00-\x1f\\"])/g, function(a, b) {
					var c = json.m[b];
					if (c) {
						return c;
					}
					c = b.charCodeAt();
					return '\\u00' +
					Math.floor(c / 16).toString(16) + (c % 16).toString(16);
				});
			}
			return '"' + x + '"';
		}
	}
};
