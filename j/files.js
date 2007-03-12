// see license.txt for licensing
var kfm_file_bits={
	contextmenu:function(e){
		e=getEvent(e);
		{ // variables
			var name=this.kfm_attributes.name,links=[],i,id=this.kfm_attributes.id;
			var extension=name.replace(/.*\./,'').toLowerCase();
			var writable=this.kfm_attributes.writable;
		}
		{ // add the links
			if(selectedFiles.length>1)links.push(['javascript:kfm_deleteSelectedFiles()',kfm_lang.DeleteFile,'remove']);
			else{
				links.push(['javascript:kfm_deleteFile('+id+')',kfm_lang.DeleteFile,'remove']);
				links.push(['javascript:kfm_renameFile('+id+')',kfm_lang.RenameFile,'edit']);
				if(this.kfm_attributes.image_data){
					if(writable){
						links.push(['javascript:kfm_rotateImage('+id+',270)',kfm_lang.RotateClockwise,'rotate_cw']);
						links.push(['javascript:kfm_rotateImage('+id+',90)',kfm_lang.RotateAntiClockwise,'rotate_ccw']);
						links.push(['javascript:kfm_resizeImage('+id+')',kfm_lang.ResizeImage,'resize_image']);
					}
					links.push(['javascript:x_kfm_getFileUrl('+id+',kfm_showImage)',kfm_lang.ViewImage]);
					links.push(['javascript:kfm_returnThumbnail('+id+',kfm_showImage)',kfm_lang.ReturnThumbnailToOpener]);
					links.push(['javascript:kfm_changeCaption('+id+')',kfm_lang.ChangeCaption,'edit']);
				}
				if(kfm_inArray(['zip'],extension))links.push(['javascript:kfm_extractZippedFile("'+id+'")',kfm_lang.ExtractZippedFile,'extract_zip']);
				if(kfm_inArray(viewable_extensions,extension))links.push(['javascript:x_kfm_viewTextFile('+id+',kfm_viewTextFile)','view','edit']);
				if(writable && kfm_inArray(editable_extensions,extension))links.push(['javascript:kfm_editTextFile("'+id+'")',kfm_lang.EditTextFile,'edit']);
			}
			links.push(['javascript:kfm_tagAdd('+id+')',kfm_lang.AddTagsToFiles,'add_tags']);
			links.push(['javascript:kfm_tagRemove('+id+')',kfm_lang.RemoveTagsFromFiles]);
			kfm_createContextMenu(getMouseAt(getEvent(e)),links);
		}
	},
	mousedown:function(e){
		e=getEvent(e);
		if(e.button==2)return;
		var id=this.kfm_attributes.id;
		addEvent(document,'mouseup',kfm_file_dragFinish);
		clearTimeout(window.dragSelectionTrigger);
		window.dragTrigger=setTimeout('kfm_file_dragStart('+id+')',100);
	},
	padding:0
}
var kfm_regexps={
	all_up_to_last_dot:/.*\./,
	all_up_to_last_slash:/.*\//,
	get_filename_extension:/.*\.([^.]*)$/,
	remove_filename_extension:/\.[^.]*$/
}
function kfm_deleteFile(id){
	var filename=$('kfm_file_icon_'+id).kfm_attributes.name;
	if(confirm(kfm_lang.DelFileMessage(filename))){
		kfm_filesCache[filename]=null;
		x_kfm_rm(id,kfm_refreshFiles);
	}
}
function kfm_deleteSelectedFiles(){
	var names=[];
	for(var i=0;i<selectedFiles.length;++i)names.push($('kfm_file_icon_'+selectedFiles[i]).kfm_attributes.name);
	if(confirm(kfm_lang.DelMultipleFilesMessage+names.join('\n'))){
		for(var i in selectedFiles)kfm_filesCache[selectedFiles[i]]=null;
		x_kfm_rm(selectedFiles,kfm_refreshFiles);
	}
}
function kfm_downloadFileFromUrl(){
	var url=$('kfm_url').value;
	if(url.substring(0,4)!='http'){
		kfm_log(kfm_lang.UrlNotValidLog);
		return;
	}
	var filename=url.replace(kfm_regexps.all_up_to_last_slash,''),msg='';
	do{
		var not_ok=0;
		filename=kfm_prompt(kfm_lang.FileSavedAsMessage+msg,filename);
		if(!filename)return;
		if(kfm_isFileInCWD(filename)){
			var o=confirm(kfm_lang.AskIfOverwrite(filename));
			if(!o)not_ok=1;
		}
		if(filename.indexOf('/')>-1){
			msg=kfm_lang.NoForwardslash;
			not_ok=1;
		}
	}while(not_ok);
	x_kfm_downloadFileFromUrl(url,filename,kfm_refreshFiles);
	$('kfm_url').value='';
}
function kfm_extractZippedFile(id){
	x_kfm_extractZippedFile(id,kfm_refreshFiles);
}
function kfm_isFileInCWD(filename){
	var i,files=$('kfm_right_column').fileids;
	for(i in files)if(files[i]==filename)return true;
	return false;
}
function kfm_incrementalFileDisplay(){
	var a=window.kfm_incrementalFileDisplay_vars.at,fsdata=window.kfm_incrementalFileDisplay_vars.data.files,wrapper=$('kfm_right_column');
	var fdata=fsdata[a];
	if(wrapper.contentMode!='file_icons'){
		window.kfm_incrementalFileDisplay_vars=null;
		return;
	}
	var name=fdata.name,ext=name.replace(kfm_regexps.all_up_to_last_dot,''),b,fullfilename=kfm_cwd_name+'/'+name,id=fdata.id,nameEl=newEl('span',0,'filename',name);
	var el=newEl('div','kfm_file_icon_'+id,'kfm_file_icon kfm_icontype_'+ext).setCss('cursor:'+(Browser.isIE?'hand':'pointer'));
	var writable=fdata.writable;
	{ // add events
		addEvent(el,'click',kfm_toggleSelectedFile);
		addEvent(el,'dblclick',kfm_chooseFile);
		el.contextmenu=kfm_file_bits.contextmenu;
		addEvent(el,'mousedown',kfm_file_bits.mousedown);
	}
	{ // file attributes
		if(kfm_filesCache[id]){
			el.kfm_attributes=kfm_filesCache[id];
			if(kfm_filesCache[id].image_data)kfm_showIcon([id,kfm_filesCache[id].image_data],el);
		}
		else{
			el.kfm_attributes=fdata;
			for(b in kfm_imageExts)if(kfm_imageExts[b]==ext.toLowerCase())x_kfm_getThumbnail(id,64,64,kfm_showIcon);
		}
		wrapper.files[a]=el;
	}
	wrapper.addEl(el);
	var reqWidth=el.offsetWidth;
	el.appendChild(nameEl);
	el.style.width='auto';
	if(el.offsetWidth>reqWidth){
		var extension='';
		el.title=name;
		if(name.indexOf('.')>-1){
			extension=name.replace(kfm_regexps.get_filename_extension,'$1');
			name=name.replace(kfm_regexps.remove_filename_extension,'')+'.';
		}
		var nameEl=el.getElementsByTagName('span')[0];
		nameEl.delClass('filename');
		kfm_shrinkName(name,el,nameEl,'offsetWidth',reqWidth,extension);
	}
	el.style.width=reqWidth-kfm_file_bits.padding;
	if(el.offsetWidth!=reqWidth){ // padding is causing an error in width
		kfm_file_bits.padding=el.offsetWidth-reqWidth;
		el.style.width=reqWidth-kfm_file_bits.padding;
	}
	window.kfm_incrementalFileDisplay_vars.at=a+1;
	if(a+1<fsdata.length)window.kfm_incrementalFileDisplay_loader=setTimeout('kfm_incrementalFileDisplay()',1);
}
function kfm_refreshFiles(res){
	if(window.kfm_incrementalFileDisplay_loader){
		clearTimeout(window.kfm_incrementalFileDisplay_loader);
		window.kfm_incrementalFileDisplay_vars=null;
	}
	if(!res)return;
	if(res.toString()===res)return kfm_log(res);
	window.kfm_incrementalFileDisplay_vars={at:0,data:res};
	var a,b,fileids=[],wrapper=$('kfm_right_column').empty();
	wrapper.contentMode='file_icons';
	wrapper.addEl(newEl('div',0,'kfm_panel_header',kfm_lang.CurrentWorkingDir(res.reqdir)));
	for(var a=0;a<res.files.length;++a)fileids[a]=res.files[a].id;
	wrapper.fileids=fileids;
	wrapper.files=[];
	document.title=res.reqdir;
	kfm_lastClicked=null;
	kfm_log(kfm_lang.FilesRefreshed);
	if(res.uploads_allowed)kfm_addPanel('kfm_left_column','kfm_file_upload_panel');
	else kfm_removePanel('kfm_left_column','kfm_file_upload_panel');
	kfm_refreshPanels('kfm_left_column');
	if(!res.files.length)wrapper.addEl(newEl('span',0,'kfm_empty',kfm_lang.DirEmpty(res.reqdir)));
	else kfm_incrementalFileDisplay();
}
function kfm_renameFile(id){
	var filename=$('kfm_file_icon_'+id).kfm_attributes.name;
	var newName=kfm_prompt(kfm_lang.RenameFileToWhat(filename),filename);
	if(!newName||newName==filename)return;
	kfm_filesCache[id]=null;
	kfm_log(kfm_lang.RenamedFile(filename,newName));
	x_kfm_renameFile(id,newName,kfm_refreshFiles);
}
function kfm_renameFiles(){
	var nameTemplate='',ok=false;
	do{
		nameTemplate=kfm_prompt(kfm_lang.HowWouldYouLikeToRenameTheseFiles,nameTemplate);
		var asterisks=nameTemplate.replace(/[^*]/g,'').length;
		if(!nameTemplate)return;
		if(!/\*/.test(nameTemplate))alert(kfm_lang.YouMustPlaceTheWildcard);
		else if(/\*[^*]+\*/.test(nameTemplate))alert(kfm_lang.IfYouUseMultipleWildcards);
		else if(asterisks<(''+selectedFiles.length).length)alert(kfm_lang.YouNeedMoreThan(asterisks,selectedFiles.length));
		else ok=true;
	}while(!ok);
	for(var i=0;i<selectedFiles.length;++i)kfm_filesCache[selectedFiles[i]]=null;
	x_kfm_renameFiles(selectedFiles,nameTemplate,kfm_refreshFiles);
}
function kfm_runSearch(){
	kfm_run_delayed('search','var keywords=$("kfm_search_keywords").value,tags=$("kfm_search_tags").value;if(keywords==""&&tags=="")x_kfm_loadFiles(kfm_cwd_id,kfm_refreshFiles);else x_kfm_search(keywords,tags,kfm_refreshFiles)');
}
function kfm_showFileDetails(res){
	var fd=$('kfm_file_details_panel'),el=$('kfm_left_column');
	if(!fd){
		kfm_addPanel('kfm_left_column','kfm_file_details_panel');
		kfm_refreshPanels(el);
	}
	var body=getElsWithClass('kfm_panel_body','DIV',$('kfm_file_details_panel'))[0].empty();
	if(!res){
		body.innerHTML=kfm_lang.NoFilesSelected;
		return;
	}
	var table=newEl('table'),r;
	{ // filename
		r=table.addRow();
		r.addCell(0,0,newEl('strong',0,0,kfm_lang.Filename));
		r.addCell(1,0,res.filename);
	}
	{ // filesize
		r=table.addRow();
		r.addCell(0,0,newEl('strong',0,0,kfm_lang.Filesize));
		r.addCell(1,0,res.filesize);
	}
	{ // mimetype
		r=table.addRow();
		r.addCell(0).addEl(newEl('strong',0,0,kfm_lang.Mimetype));
		r.addCell(1).addEl(res.mimetype);
	}
	if(res.tags.length){ // tags
		r=table.addRow();
		r.addCell(0).addEl(newEl('strong',0,0,kfm_lang.Tags));
		var arr=[],c=r.addCell(1);
		for(var i=0;i<res.tags.length;++i){
			c.addEl(kfm_tagDraw(res.tags[i]));
			if(i!=res.tags.length-1)c.addEl(', ');
		}
	}
	switch(res.mimetype.replace(/\/.*/,'')){
		case 'image':{
			{ // caption
				r=table.addRow();
				r.addCell(0,0,newEl('strong',0,0,kfm_lang.Caption));
				r.addCell(1).innerHTML=(res.caption).replace(/\n/g,'<br \/>');
			}
			break;
		}
	}
	body.addEl(table);
}
