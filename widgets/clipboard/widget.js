function Clipboard(){
	this.istarget=0;
	this.name='Clipboard'; // TODO: new string
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
		el.addEvent('mousedown',function(e){
			e=new Event(e);
			if(e.rightClick)return;
			document.addEvent('mouseup',$('kfm_widget_clipboard_container').dragFinish);
			$clear(window.dragSelectionTrigger);
			window.dragTrigger=setTimeout("$('kfm_widget_clipboard_container').dragStart()",100);
		});
		el.drag=function(e){
			if(!window.dragType||window.dragType!=3)return;
			clearSelections();
			e=new Event(e);
			var m=e.page;
			var w=drag_wrapper.offsetWidth,h=drag_wrapper.offsetHeight,ws=window.getSize().size;
			var x=(w+m.x>ws.x-16)?ws.x-w:m.x+16;
			var y=(h+m.y>ws.y)?ws.y-h:m.y;
			if(x<0)x=0;
			if(y<0)y=0;
			window.drag_wrapper.setStyles('display:block;left:'+x+'px;top:'+y+'px');
		};
		el.dragFinish=function(e){
			e=new Event(e);
			var el=$('kfm_widget_clipboard_container');
			$clear(window.dragTrigger);
			if(!window.dragType||window.dragType!=3)return;
			window.dragType=0;
			window.drag_wrapper.remove();
			window.drag_wrapper=null;
			document.removeEvent('mousemove',el.drag);
			document.removeEvent('mouseup',el.dragFinish);
			var q=kfm.getContainer(e.page,$ES('#kfm_right_column'));
			if(q)el.pasteContents();
		};
		el.dragStart=function(e){
			var el=$('kfm_widget_clipboard_container');
			if(!el.files.length && !el.folders.length)return;
			window.dragType=3;
			var w=window.getSize().size;
			window.drag_wrapper=new Element('div',{
				'id':'kfm_drag_wrapper',
				styles:{
					'display':'none',
					'opacity':'.7'
				}
			});
			for(var i=0;i<10&&i<el.files.length;++i)kfm.addEl(window.drag_wrapper,[File_getInstance(el.files[i]).name,new Element('br')]);
			if(el.files.length>10)kfm.addEl(
				window.drag_wrapper,
				(new Element('i')).setHTML(kfm.lang.AndNMore(el.files.length-10))
			);
			document.body.appendChild(window.drag_wrapper);
			document.addEvent('mousemove',el.drag);
		};
		return el;
	}
	return this;
}
kfm_addWidget(new Clipboard());
