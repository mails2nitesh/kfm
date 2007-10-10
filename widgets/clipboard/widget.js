function Clipboard(){
	this.istarget=0;
	this.name='Clipboard';
	this.files=[];
	this.folders=[];
	this.display=function(){
		el=new Element('div',{
			'id':'kfm_widget_clipboard_container',
			'events':{
				'mouseover':function(){kfm_widgets['clipboard'].istarget=1;},
				'mouseout':function(){kfm_widgets['clipboard'].istarget=0;}
			},
			'class':'widget_drag_target',
			'styles':{
				'width':'50px',
				'height':'50px',
				'background-color':'blue'
			}
		});
		el.action=function(files){
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
