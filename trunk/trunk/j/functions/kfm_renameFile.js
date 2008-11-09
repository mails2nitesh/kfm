window.kfm_renameFile=function(id){
	var filename=File_getInstance(id).name;
	kfm_prompt(kfm.lang.RenameFileToWhat(filename),filename,function(newName){
		if(!newName||newName==filename)return;
		x_kfm_renameFile(id,newName,kfm_refreshFiles);
	});
}
