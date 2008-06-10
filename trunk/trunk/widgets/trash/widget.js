function Trash(){
	this.istarget=0;
	this.name='Trash';
	this.display=function(){
		if(!kfm_vars.permissions.file.rm)return false;
		el=document.createElement('img');
		el.src='widgets/trash/trash.png';
		el.className='widget_trash';
		el.title=this.name;
		el.style.display='block';
		$j(el).css('float','left');
		el.style.width='70px';
		el.style.height='70px';
		if(kfm_theme=="blt")$j(el).attr('src','widgets/trash/trash_blt.png');
		el.action=function(files,dirs){
			kfm_deleteFiles(files);
		}
		return el;
	}
	this.action=function(files){
	}
}
if(kfm_vars.permissions.file.rm)kfm_addWidget(new Trash());
kdnd_addDropHandler('kfm_file','.widget_trash',function(e){
	if(!selectedFiles.length)kfm_addToSelection(e.sourceElement.id.replace(/.*_/,''));
	e.targetElement.action(selectedFiles,[]);
});
kdnd_addDropHandler('kfm_dir_name','.widget_trash',function(e){
	var dir_from=parseInt($E('.kfm_directory_link',e.sourceElement).node_id);
	e.targetElement.action([],[dir_from]);
});
