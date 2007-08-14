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
var KFM=new Class({
	addCell:function(o,b,c,d,e){
		var f=o.insertCell(b);
		if(c)f.colSpan=c;
		if(d)kfm.addEl(f,d);
		if(e)f.className=e;
		return f;
	},
	addEl:function(o,a){
		if(!a)return o;
		if($type(a)!='array')a=[a];
		for(var i=0;i<a.length;++i){
			if($type(a[i])=='array')kfm.addEl(o,a[i]);
			else o.appendChild(a[i].toString()===a[i]?newText(a[i]):a[i]);
		}
		return o;
	},
	addRow:function(t,p,c){
		var o=t.insertRow(p===parseInt(p)?p:t.rows.length);
		o.className=c;
		return o;
	},
	alert:function(txt){
		window.inPrompt=1;
		alert(txt);
		setTimeout('window.inPrompt=0',1);
	},
	build:function(){
		var form_panel,form,right_column,directories,logs,logHeight=64,w=getWindowSize(),j,i;
		{ // extend language objects
			for(var j in kfm.lang){
				if(kfm_regexps.percent_numbers.test(kfm.lang[j])){
					kfm.lang[j]=(function(str){
						return function(){
							var tmp=str;
							for(i=1;i<arguments.length+1;++i)tmp=tmp.replace("%"+i,arguments[i-1]);
							return tmp;
						};
					})(kfm.lang[j]);
				}
			}
		}
		kfm_cwd_name=starttype;
		$(document.body).setStyle('overflow','hidden');
		{ // create left column
			var left_column=kfm_createPanelWrapper('kfm_left_column');
			kfm_addPanel(left_column,'kfm_directories_panel');
			kfm_addPanel(left_column,'kfm_search_panel');
			kfm_addPanel(left_column,'kfm_directory_properties_panel');
			if(!kfm_inArray('kfm_logs_panel',kfm_hidden_panels))kfm_addPanel(left_column,'kfm_logs_panel');
			left_column.panels_unlocked=1;
			left_column.setStyles('height:'+w.y+'px');
			left_column.addEvent('contextmenu',function(e){
				var m=getMouseAt(e);
				e=new Event(e);
				{ // variables
					var row,cell,cells,rows=0,target=kfm.getParentEl(e.target,'DIV');
				}
				{ // add the links
					var links=[],i;
					var l=left_column.panels_unlocked;
					links.push(['kfm_togglePanelsUnlocked()',l?kfm.lang.LockPanels:kfm.lang.UnlockPanels,l?'lock':'unlock']);
					var ps=left_column.panels;
					for(var i=0;i<ps.length;++i){
						var p=$(ps[i]);
						if(!p.visible && !kfm_inArray(ps[i],kfm_hidden_panels))links.push(['kfm_addPanel("kfm_left_column","'+ps[i]+'")',kfm.lang.ShowPanel(p.panel_title),'show_panel']);
					}
					kfm_createContextMenu(m,links);
				}
			});
		}
		{ // create right_column
			right_column=new Element('div',{
				'id':'kfm_right_column'
			});
			right_column.addEvent('click',function(){if(!window.dragType)kfm_selectNone()});
			right_column.addEvent('mousedown',function(e){
				if(e.button==2)return;
				window.mouseAt=getMouseAt(e);
				if(this.contentMode=='file_icons' && this.fileids.length)window.dragSelectionTrigger=setTimeout(function(){kfm_selection_dragStart()},200);
				right_column.addEvent('mouseup',kfm_selection_dragFinish);
			});
			right_column.addEvent('contextmenu',function(e){
				var links=[],i;
				links.push(['kfm_createEmptyFile()',kfm.lang.CreateEmptyFile,'filenew',!kfm_vars.permissions.file.mk]);
				if(selectedFiles.length>1)links.push(['kfm_renameFiles()',kfm.lang.RenameFile,'edit',!kfm_vars.permissions.file.ed]);
				if(selectedFiles.length>1)links.push(['kfm_zip()','zip up files','',!kfm_vars.permissions.file.mk]); // TODO: new string
				if(selectedFiles.length!=$('kfm_right_column').fileids.length)links.push(['kfm_selectAll()',kfm.lang.SelectAll,'ark_selectall']);
				if(selectedFiles.length){ // select none, invert selection
					links.push(['kfm_selectNone()',kfm.lang.SelectNone,'select_none']);
					links.push(['kfm_selectInvert()',kfm.lang.InvertSelection,'invert_selection']);
				}
				kfm_createContextMenu(getMouseAt(getEvent(e,1)),links);
			});
			right_column.parentResized=kfm_files_panelResized;
		}
		{ // draw areas to screen and load files and directory info
			kfm.addEl($(document.body).empty(),[left_column,right_column]);
			x_kfm_loadFiles(1,kfm_refreshFiles);
			x_kfm_loadDirectories(1,kfm_refreshDirectories);
		}
		document.addEvent('keyup',kfm.keyup);
		window.addEvent('resize',kfm.handleWindowResizes);
		kfm_contextmenuinit();
	},
	confirm:function(txt){
		window.inPrompt=1;
		var ret=confirm(txt);
		setTimeout('window.inPrompt=0',1);
		return ret;
	},
	getContainer:function(p,c){
		for(i=0;i<c.length;++i){
			var a=c[i],x=getOffset(a,'Left'),y=getOffset(a,'Top');
			if(x<p.x&&y<p.y&&x+a.offsetWidth>p.x&&y+a.offsetHeight>p.y)return a;
		}
	},
	getParentEl:function(c,t){
		while(c.tagName!=t&&c)c=c.parentNode;
		return c;
	},
	handleWindowResizes:function(){
		var w=getWindowSize();
		var to_max_height=['kfm_left_column','kfm_left_column_hider','kfm_lightboxShader','kfm_lightboxWrapper'];
		var to_max_width=['kfm_lightboxShader','kfm_lightboxWrapper'];
		for(var i=0;i<to_max_height.length;++i)if($(to_max_height[i]))$(to_max_height[i]).setStyle('height',w.y);
		for(var i=0;i<to_max_width.length;++i)if($(to_max_width[i]))$(to_max_width[i]).setStyle('width',w.x);
		if($('kfm_codepressTableCell')){
			var el=$('kfm_codepressTableCell'),iframe=$E('iframe',el);
			iframe.style.height=0;
			iframe.style.width=0;
			iframe.style.height=(el.offsetHeight-10)+'px';
			iframe.style.width=(el.offsetWidth-10)+'px';
		}
		kfm_refreshPanels('kfm_left_column');
		var els=$ES('body *');
		els.each(function(el){
			if(el.parentResized)el.parentResized();
		});
	},
	initialize:function(){
		document.addEvent('domready',this.build);
	},
	keyup:function(e){
		var e=new Event(e);
		var key=e.code;
		var cm=$('kfm_right_column').contentMode;
		switch(key){
			case 13:{ // enter
				if(!selectedFiles.length||window.inPrompt||cm!='file_icons')return;
				if(selectedFiles.length>1)return kfm_log(kfm.lang.NotMoreThanOneFile);
				kfm_chooseFile($('kfm_file_icon_'+selectedFiles[0]),1);
				break;
			}
			case 27:{ // escape
				if(cm=='lightbox')kfm_img_stopLightbox();
				else if(!window.inPrompt&&kfm.confirm(kfm.lang.AreYouSureYouWantToCloseKFM))window.close();
				break;
			}
			case 37:{ // left arrow
				if(cm=='file_icons')kfm_shiftFileSelectionLR(-1);
				else if(cm=='lightbox'){
					window.kfm_slideshow_stopped=1;
					if(window.lightbox_slideshowTimer)clearTimeout(window.lightbox_slideshowTimer);
					window.kfm_slideshow.at-=2;
					kfm_img_startLightbox();
				}
				else break;
				e.stopPropagation();
				break;
			}
			case 38:{ // up arrow
				if(cm=='file_icons')kfm_shiftFileSelectionUD(-1);
				break;
			}
			case 39:{ // right arrow
				if(cm=='file_icons')kfm_shiftFileSelectionLR(1);
				else if(cm=='lightbox'){
					window.kfm_slideshow_stopped=1;
					if(window.lightbox_slideshowTimer)clearTimeout(window.lightbox_slideshowTimer);
					kfm_img_startLightbox();
				}
				else break;
				e.stopPropagation();
				break;
			}
			case 40:{ // down arrow
				if(cm=='file_icons')kfm_shiftFileSelectionUD(1);
				break;
			}
			case 46:{ // delete
				if(!selectedFiles.length||cm!='file_icons')return;
				if(selectedFiles.length>1)kfm_deleteSelectedFiles();
				else kfm_deleteFile(selectedFiles[0]);
				break;
			}
			case 65:{ // a
				if(e.control&&cm=='file_icons'){
					clearSelections(e);
					kfm_selectAll();
				}
				break;
			}
			case 85:{ // u
				if(e.control&&cm=='file_icons'){
					clearSelections(e);
					kfm_selectNone();
				}
				break;
			}
			case 113:{ // f2
				if(cm!='file_icons')return;
				if(!selectedFiles.length)return kfm.alert(kfm.lang.PleaseSelectFileBeforeRename);
				if(selectedFiles.length==1){
					kfm_renameFile(selectedFiles[0]);
				}
				else kfm.alert(kfm.lang.RenameOnlyOneFile);
			}
		}
	}
});
function kfm_inArray(needle,haystack){
	for(var i=0;i<haystack.length;++i)if(haystack[i]==needle)return true;
	return false;
}
function kfm_log(msg){
	var wrapper=$('kfm_logs_panel');
	if(!wrapper){
		if(msg.indexOf(kfm.lang.ErrorPrefix)!=0 && msg.indexOf('error: ')!=0)return;
		if(kfm_inArray('kfm_logs_panel',kfm_hidden_panels))return kfm.alert(msg.replace(kfm.lang.ErrorPrefix,'').replace('error: ',''));
		kfm_addPanel('kfm_left_column','kfm_logs_panel');
		kfm_refreshPanels('kfm_left_column');
		wrapper=$('kfm_logs_panel');
	}
	wrapper.visible=1;
	var el=$E('#kfm_logs_panel div.kfm_panel_body'),p=(new Element('p')).setHTML(msg);
	if(msg.indexOf(kfm.lang.ErrorPrefix)==0)p.setStyles('background:#ff0;fontWeight:bold;color:red');
	kfm.addEl(el,p);
	el.scrollTop=el.scrollTop+p.offsetHeight;
}
function kfm_prompt(txt,val){
	window.inPrompt=1;
	var newVal=prompt(txt,val?val:'');
	setTimeout('window.inPrompt=0',1);
	return newVal;
}
function kfm_run_delayed(name,call){
	name=name+'_timeout';
	if(window[name])$clear(window[name]);
	window[name]=setTimeout(call,500);
}
function kfm_shrinkName(name,wrapper,text,size,maxsize,extension){
	var position=step=Math.ceil(name.length/2),postfix='[...]'+extension,prefix=size=='offsetHeight'?'. ':'';
	do{
		text.innerHTML=prefix+name.substring(0,position)+postfix;
		step=Math.ceil(step/2);
		position+=(wrapper[size]>maxsize)?-step:step;
	}while(step>1);
	var html='<span class="filename">'+name.substring(0,position+(prefix?0:-1))+'</span><span style="color:red;text-decoration:none">[...]</span>';
	if(extension)html+='<span class="filename">'+extension+'</span>';
	text.innerHTML=html;
}
var kfm_regexps={
	all_up_to_last_dot:/.*\./,
	all_up_to_last_slash:/.*\//,
	ascii_stuff:/%([89A-F][A-Z0-9])/g,
	get_filename_extension:/.*\.([^.]*)$/,
	percent_numbers:/%[1-9]/,
	plus:/\+/g,
	remove_filename_extension:/\.[^.]*$/
}
var kfm=new KFM();
