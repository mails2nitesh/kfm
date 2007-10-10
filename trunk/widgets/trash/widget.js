function Trash(){
	this.istarget=0;
	this.name='Trash';
	this.display=function(){
		if(!kfm_vars.permissions.file.rm)return false;
		el=new Element('img',{
			'src':'widgets/trash/trash.png',
			'events':{
				'mouseover':function(){kfm_widgets['trash'].istarget=1;},
				'mouseout':function(){kfm_widgets['trash'].istarget=0;}
			},
			'class':'widget_drag_target'
		});
		el.action=function(files){
			kfm_deleteFiles(files);
		}
		return el;
	}
	this.action=function(files){
	}
}
kfm_addWidget(new Trash());
