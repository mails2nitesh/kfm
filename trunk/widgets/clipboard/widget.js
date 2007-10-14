function Clipboard(){
	this.istarget=0;
	this.name='Clipboard';
	this.files=[];
	this.folders=[];
	this.display=function(){
		el=new Element('div',{
			'id':'kfm_widget_clipboard_container',
			'class':'widget_drag_target',
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
				if(this.files.length)html=html+'<br/>'+this.files.length+' files';
				if(this.folders.length)html=html+'<br/>'+this.folders.length+' folders';
			}else this.style.backgroundImage='url(\'widgets/clipboard/clipboard_empty.png\')';
			this.innerHTML=html;
		}
		el.action=function(files,folders){
			alert('action');
			for(var i=0;i<files.length;i++){
				files[i]=parseInt(files[i]); //a bug, difference between one file and a selection
				if(this.files.indexOf(files[i])<0)this.files.push(files[i]);
			}
			for(var i=0;i<folders.length;i++){
				folders[i]=parseInt(folders[i]); 
				if(this.folders.indexOf(folders[i])<0)this.folders.push(folders[i]);
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
			alert('todo');
		};
		kfm_addContextMenu(el,function(e){
			e=new Event(e);
			var el=$('kfm_widget_clipboard_container');
			var links=[];
			{ // add the links
				links.push(['$("kfm_widget_clipboard_container").clearContents()','clear clipboard']); // TODO: new string
				links.push(['$("kfm_widget_clipboard_container").pasteContents()','paste files']); // TODO: new string
			}
			kfm_createContextMenu(e.page,links);
		});
		return el;
	}
	return this;
}
kfm_addWidget(new Clipboard());
