function plugin_codepress(){
	this.name='codepress';
	this.title=kfm.lang.EditTextFile;
	this.mode=0; //only one file
	this.writable=1;
	this.category='edit';
	this.extensions=['css','html','js','txt','xhtml','xml'];
	this.doFunction=function(files){
		fid=files[0];
		x_kfm_getTextFile(fid, function(res){
			kfm_textfile_initEditor(res,true)
		});
	}
}
if(kfm_vars.permissions.file.ed) kfm_addHook(new plugin_codepress());
