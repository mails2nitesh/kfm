function Clipboard(){
	this.istarget=0;
	this.name='Clipboard';
	this.files=[];
	this.folders=[];
	this.display=function(){
		el=new Element('div',{
			'id':'kfm_widget_clipboard_container',
			'class':'widget_drag_target',
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
			if(this.files.length || this.folders.length){
				this.style.backgroundImage='url(\'widgets/clipboard/clipboard_full.png\')';
				var html='';
				if(this.files.length)html=html+'<br/>'+this.files.length+' files';
				if(this.folders.length)html=html+'<br/>'+this.folders.length+' folders';
				this.innerHTML=html;
			}else this.style.backgroundImage='url(\'widgets/clipboard/clipboard_empty.png\')';
		}
		el.action=function(files){
			for(var i=0;i<files.length;i++){
				files[i]=parseInt(files[i]); //a bug, difference between one file and a selection
				if(this.files.indexOf(files[i])<0)this.files.push(files[i]);
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
		}
		/* Add contextmenu with functions:
		 * clear clipboard
		 */
		return el;
	}
	return this;
}
kfm_addWidget(new Clipboard());
