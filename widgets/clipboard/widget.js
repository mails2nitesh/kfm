function Clipboard(){
	this.istarget=0;
	this.name='Clipboard'; // TODO: new string
	this.files=[];
	this.folders=[];
	this.display=function(){
		el=new Element('div',{
			'id':'kfm_widget_clipboard_container',
			'class':'widget_clipboard',
			'title':this.name,
			'styles':{
				'float':'left',
				'padding':'5px',
				'width':'70px',
				'height':'70px',
				'background-image':'url(\'widgets/clipboard/clipboard_empty.png\')',
				'background-repeat':'no-repeat',
				'font-size':'10px'
			},
			'events':{
				'mouseover':function(){
					if(selectedFiles.length) this.style.backgroundImage='url(\'widgets/clipboard/clipboard_add.png\')';
				},
				'mouseout':function(){this.setAppearance();}
			}
		});
		el.files=[];
		el.folders=[];
		el.setAppearance=function(){
			var html='';
			if(this.files.length || this.folders.length){
				this.style.backgroundImage='url(\'widgets/clipboard/clipboard_full.png\')';
				if(this.files.length)html+='<br/>'+this.files.length+' files'; // TODO: new string
				if(this.folders.length)html+='<br/>'+this.folders.length+' folders'; // TODO: new string
			}
			else this.style.backgroundImage='url(\'widgets/clipboard/clipboard_empty.png\')';
			this.innerHTML=html;
		}
		el.action=function(files,folders){
			for(var i=0;i<files.length;i++){
				if(!this.files.contains(files[i]))this.files.push(files[i]);
			}
			for(var i=0;i<folders.length;i++){
				if(!this.folders.contains(folders[i]))this.folders.push(folders[i]);
			}
			this.setAppearance();
			//if(this.files.length||this.folders.length)$(this).makeDraggable();
			/*action:
			 * merge files with kfm_widgets['clipboard'].files
			 * merge folders ...
			 * if files and folders are not empty, make draggable (change icon)
			 * $('kfm_widget_clipboard_container').innerHTML=kfm_widgets['clipboard'].files.length+' files<br/>'+
			 * +kfm_widgets['clipboard'].folders.length+' folders';
			 * can be dragged to: directories, trash
			 */
		};
		el.clearContents=function(){
			this.files=[];
			this.folders=[];
			this.setAppearance();
		};
		el.pasteContents=function(){
			if(this.files.length)x_kfm_copyFiles(this.files,kfm_cwd_id,function(m){
				kfm_showMessage(m);
				x_kfm_loadFiles(kfm_cwd_id,kfm_refreshFiles);
			});
			if(this.folders.length)kfm.alert('paste of folders is not complete'); //TODO: complete
			this.clearContents();
		};
		kfm_addContextMenu(el,function(e){
			e=new Event(e);
			var el=$('kfm_widget_clipboard_container');
			var links=[];
			{ // add the links
				links.push(['$("kfm_widget_clipboard_container").clearContents()','clear clipboard']); // TODO: new string
				links.push(['$("kfm_widget_clipboard_container").pasteContents()','paste clipboard contents']); // TODO: new string
			}
			kfm_createContextMenu(e.page,links);
		});
		setTimeout("kdnd_makeDraggable('widget_clipboard');",1);
		return el;
	}
	return this;
}
kfm_addWidget(new Clipboard());
kdnd_addDropHandler('widget_clipboard','#kfm_right_column',function(e){
	e.sourceElement.pasteContents();
});
kdnd_addDropHandler('kfm_file','.widget_clipboard',function(e){
	if(!selectedFiles.length)kfm_addToSelection(e.sourceElement.id.replace(/.*_/,''));
	e.targetElement.action(selectedFiles,[]);
});
kdnd_addDropHandler('kfm_dir_name','.widget_clipboard',function(e){
	var dir_from=parseInt($E('.kfm_directory_link',e.sourceElement).node_id);
	e.targetElement.action([],[dir_from]);
});
