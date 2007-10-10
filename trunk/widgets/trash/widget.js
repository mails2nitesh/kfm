function Trash(){
	this.istarget=0;
	this.name='Trash';
	this.display=function(){
		if(!kfm_vars.permissions.file.rm)return false;
		el=new Element('img',{
			'src':'widgets/trash/trash.png',
			'class':'widget_drag_target',
			'styles':{
				'display':'block',
				'float':'left',
				'width':'70px',
				'height':'70px'
			}
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
