// see license.txt for licensing
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
	var filename=url.replace(/.*\//,''),msg='';
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
function kfm_refreshFiles(res){
	if(res.toString()===res)return kfm_log(res);
	var files=[],a,b,fileids=[],wrapper=$('kfm_right_column').empty();
	wrapper.addEl(newEl('div',0,'kfm_panel_header',kfm_lang.CurrentWorkingDir(res.reqdir)));
	for(a in res.files){
		var name=res.files[a].name,ext=name.replace(/.*\./,''),b,fullfilename=kfm_cwd_name+'/'+name,id=res.files[a].id,nameEl=newEl('span',0,'filename',name);
		var el=newEl('div','kfm_file_icon_'+id,'kfm_file_icon kfm_icontype_'+ext).setCss('cursor:'+(Browser.isIE?'hand':'pointer'));
		var writable = res.files[a].writable;
		{ // add events
			addEvent(el,'click',kfm_toggleSelectedFile);
			addEvent(el,'dblclick',kfm_chooseFile);
			el.contextmenu=function(e){
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
							links.push(['javascript:x_kfm_getFileUrl('+id+',kfm_showImage)','View image']);
							links.push(['javascript:kfm_changeCaption('+id+')',kfm_lang.ChangeCaption,'edit']);
						}
						if(kfm_inArray(['zip'],extension))links.push(['javascript:kfm_extractZippedFile("'+id+'")',kfm_lang.ExtractZippedFile,'extract_zip']);
						if(kfm_inArray(viewable_extensions,extension))links.push(['javascript:x_kfm_viewTextFile('+id+',kfm_viewTextFile)','view','edit']);
						if(writable && kfm_inArray(editable_extensions,extension))links.push(['javascript:kfm_editTextFile("'+id+'")',kfm_lang.EditTextFile,'edit']);
					}
					links.push(['javascript:kfm_tagAdd('+id+')','add tag to file(s)','add_tags']);
					kfm_createContextMenu(getMouseAt(getEvent(e)),links);
				}
			}
			addEvent(el,'mousedown',(function(id){
				return function(e){
					if(e.button==2)return;
					addEvent(document,'mouseup',kfm_file_dragFinish);
					clearTimeout(window.dragSelectionTrigger);
					window.dragTrigger=setTimeout(function(){
						kfm_file_dragStart(id);
					},100);
				};
			})(id));
		}
		{ // file attributes
			if(kfm_filesCache[id]){
				el.kfm_attributes=kfm_filesCache[id];
				if(kfm_filesCache[id].image_data)kfm_showIcon([id,kfm_filesCache[id].image_data],el);
			}
			else{
				el.kfm_attributes=res.files[a];
				for(b in kfm_imageExts)if(kfm_imageExts[b]==ext)x_kfm_getThumbnail(id,64,64,kfm_showIcon);
			}
			files[a]=el;
			fileids[a]=id;
		}
		wrapper.addEl(el);
		var reqWidth=el.offsetWidth;
		el.appendChild(nameEl);
		el.style.width='auto';
		if(el.offsetWidth>reqWidth){
			var extension='';
			el.title=name;
			if(name.indexOf('.')>-1){
				extension=name.replace(/.*\.([^.]*)$/,'$1');
				name=name.replace(/\.[^.]*$/,'')+'.';
			}
			var nameEl=el.getElementsByTagName('span')[0];
			nameEl.delClass('filename');
			kfm_shrinkName(name,el,nameEl,'offsetWidth',reqWidth,extension);
		}
		el.style.width=reqWidth;
		el.style.width=reqWidth-(el.offsetWidth-reqWidth);
	}
	wrapper.fileids=fileids;
	if(!files.length)wrapper.addEl(newEl('span',0,'kfm_empty',kfm_lang.DirEmpty(res.reqdir)));
	document.title=res.reqdir;
	kfm_lastClicked=null;
	kfm_log(kfm_lang.FilesRefreshed);
	if(res.uploads_allowed)kfm_addPanel('kfm_left_column','kfm_file_upload_panel');
	else kfm_removePanel('kfm_left_column','kfm_file_upload_panel');
	kfm_refreshPanels('kfm_left_column');
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
		nameTemplate=kfm_prompt('How would you like to rename these files?\n\nexample: "images-***.jpg" will rename files to "images-001.jpg", "images-002.jpg", ...',nameTemplate); // TODO: new string
		var asterisks=nameTemplate.replace(/[^*]/g,'').length;
		if(!nameTemplate)return;
		if(!/\*/.test(nameTemplate))alert('You must place the wildcard character * somewhere in the filename template'); // TODO: new string
		else if(/\*[^*]+\*/.test(nameTemplate))alert('If you use multiple wildcards in the filename template, they must be grouped together'); // TODO: new string
		else if(asterisks<(''+selectedFiles.length).length)alert('You need more than '+asterisks+' * characters to create '+selectedFiles.length+' filenames'); // TODO: new string
		else ok=true;
	}while(!ok);
	for(var i=0;i<selectedFiles.length;++i)kfm_filesCache[selectedFiles[i]]=null;
	x_kfm_renameFiles(selectedFiles,nameTemplate,kfm_refreshFiles);
}
function kfm_runSearch(){
	kfm_run_delayed('search','x_kfm_search("'+$('kfm_search').value+'",kfm_refreshFiles)');
}
function kfm_showFileDetails(res){
	var fd=$('kfm_file_details_panel'),el=$('kfm_left_column');
	if(!fd){
		kfm_addPanel('kfm_left_column','kfm_file_details_panel');
		kfm_refreshPanels(el);
	}
	var body=getElsWithClass('kfm_panel_body','DIV',$('kfm_file_details_panel'))[0].empty();
	if(!res){
		body.innerHTML='no files selected'; // TODO: new string
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
		r.addCell(0).addEl(newEl('strong',0,0,'tags')); // TODO: new string
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
