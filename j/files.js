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
			if(selectedFiles.length>1){
				if(!browser.isIE)links.push(['kfm_downloadSelectedFiles()','download selected files']); // IE can't handle this...
				links.push(['kfm_deleteSelectedFiles()',kfm.lang.DeleteFile,'remove',!kfm_vars.permissions.file.rm]);
				var imgs=[];
				for(var i=0;i<selectedFiles.length;++i)if($('kfm_file_icon_'+selectedFiles[i]).kfm_attributes.width)imgs.push(selectedFiles[i]);
				if(imgs.length)links.push(['kfm_img_startLightbox(['+imgs.join(',')+'])','view slideshow']);
			}
			else{
				links.push(['kfm_downloadSelectedFiles('+id+')','download file']);
				links.push(['kfm_deleteFile('+id+')',kfm.lang.DeleteFile,'remove',!kfm_vars.permissions.file.rm]);
				links.push(['kfm_renameFile('+id+')',kfm.lang.RenameFile,'edit',!kfm_vars.permissions.file.ed]);
				if(this.kfm_attributes.width){
					if(writable){
						links.push(['kfm_rotateImage('+id+',270)',kfm.lang.RotateClockwise,'rotate_cw',!kfm_vars.permissions.file.ed]);
						links.push(['kfm_rotateImage('+id+',90)',kfm.lang.RotateAntiClockwise,'rotate_ccw',!kfm_vars.permissions.file.ed]);
						links.push(['kfm_resizeImage('+id+')',kfm.lang.ResizeImage,'resize_image',!kfm_vars.permissions.file.ed]);
					}
					links.push(['kfm_img_startLightbox('+id+')',kfm.lang.ViewImage]);
					links.push(['kfm_returnThumbnail('+id+')',kfm.lang.ReturnThumbnailToOpener]);
					links.push(['kfm_changeCaption('+id+')',kfm.lang.ChangeCaption,'edit',!kfm_vars.permissions.file.ed]);
				}
				if(kfm_inArray(extension,['zip']))links.push(['kfm_extractZippedFile("'+id+'")',kfm.lang.ExtractZippedFile,'extract_zip',!kfm_vars.permissions.file.mk]);
				if(kfm_inArray(extension,viewable_extensions)){
					links.push(['x_kfm_viewTextFile('+id+',kfm_viewTextFile)','view','edit']);
					if(writable&&kfm_inArray(extension,editable_extensions))links.push(['x_kfm_getTextFile("'+id+'",kfm_showTextFile)',kfm.lang.EditTextFile,'edit',!kfm_vars.permissions.file.ed]);
				}
			}
			links.push(['kfm_tagAdd('+id+')',kfm.lang.AddTagsToFiles,'add_tags',!kfm_vars.permissions.file.ed]);
			links.push(['kfm_tagRemove('+id+')',kfm.lang.RemoveTagsFromFiles,'',!kfm_vars.permissions.file.ed]);
			kfm_createContextMenu(getMouseAt(getEvent(e)),links);
		}
	},
	mousedown:function(e){
		e=getEvent(e);
		if(e.button==2)return;
		var id=this.kfm_attributes.id;
		document.addEvent('mouseup',kfm_file_dragFinish);
		$clear(window.dragSelectionTrigger);
		window.dragTrigger=setTimeout('kfm_file_dragStart('+id+')',100);
	},
	padding:0
}
function kfm_buildFileDetailsTable(res){
	if(!res)return kfm_log('error: missing file details?');
	var table=new Element('table'),r;
	if(res.filename){ // filename
		r=kfm.addRow(table);
		kfm.addCell(r,0,0,(new Element('strong')).setHTML(kfm.lang.Filename));
		kfm.addCell(r,1,0,res.filename);
	}
	if(res.filesize){ // filesize
		r=kfm.addRow(table);
		kfm.addCell(r,0,0,(new Element('strong')).setHTML(kfm.lang.Filesize));
		kfm.addCell(r,1,0,res.filesize);
	}
	if(res.tags&&res.tags.length){ // tags
		r=kfm.addRow(table);
		kfm.addEl(kfm.addCell(r,0),(new Element('strong')).setHTML(kfm.lang.Tags));
		var arr=[],c=kfm.addCell(r,1);
		for(var i=0;i<res.tags.length;++i){
			kfm.addEl(c,kfm_tagDraw(res.tags[i]));
			if(i!=res.tags.length-1)kfm.addEl(c,', ');
		}
	}
	if(res.mimetype){ // mimetype
		r=kfm.addRow(table);
		kfm.addEl(kfm.addCell(r,0),(new Element('strong')).setHTML(kfm.lang.Mimetype));
		kfm.addEl(kfm.addCell(r,1),res.mimetype);
		switch(res.mimetype.replace(/\/.*/,'')){
			case 'image':{
				if(res.caption){ // caption
					r=kfm.addRow(table);
					kfm.addCell(r,0,0,(new Element('strong')).setHTML(kfm.lang.Caption));
					kfm.addCell(r,1).innerHTML=(res.caption).replace(/\n/g,'<br \/>');
				}
				break;
			}
		}
	}
	return table;
}
function kfm_deleteFile(id){
	if(!kfm_vars.permissions.file.rm)return kfm.alert(kfm.lang.PermissionDeniedCannotDeleteFile);
	var filename=$('kfm_file_icon_'+id).kfm_attributes.name;
	if(kfm.confirm(kfm.lang.DelFileMessage(filename))){
		kfm_filesCache[filename]=null;
		x_kfm_rm([id],kfm_removeFilesFromView);
	}
}
function kfm_deleteSelectedFiles(){
	if(!kfm_vars.permissions.file.rm)return kfm.alert('permission denied: cannot delete files');
	var names=[],m='';
	if(selectedFiles.length>10){
		for(var i=0;i<9;++i)names.push($('kfm_file_icon_'+selectedFiles[i]).kfm_attributes.name);
		m='\n'+kfm.lang.AndNMore(selectedFiles.length-9);
	}
	else for(var i=0;i<selectedFiles.length;++i)names.push($('kfm_file_icon_'+selectedFiles[i]).kfm_attributes.name);
	if(kfm.confirm(kfm.lang.DelMultipleFilesMessage+names.join('\n')+m)){
		for(i=0;i<selectedFiles.length;++i)kfm_filesCache[selectedFiles[i]]=null;
		x_kfm_rm(selectedFiles,kfm_removeFilesFromView);
	}
}
function kfm_downloadFileFromUrl(){
	var url=$('kfm_url').value;
	if(url.substring(0,4)!='http'){
		kfm_log(kfm.lang.UrlNotValidLog);
		return;
	}
	var filename=url.replace(kfm_regexps.all_up_to_last_slash,''),msg='';
	do{
		var not_ok=0,o;
		filename=kfm_prompt(kfm.lang.FileSavedAsMessage+msg,filename);
		if(!filename)return;
		if(kfm_isFileInCWD(filename)){
			o=kfm.confirm(kfm.lang.AskIfOverwrite(filename));
			if(!o)not_ok=1;
		}
		if(filename.indexOf('/')>-1){
			msg=kfm.lang.NoForwardslash;
			not_ok=1;
		}
	}while(not_ok);
	x_kfm_downloadFileFromUrl(url,filename,kfm_refreshFiles);
	$('kfm_url').value='';
}
function kfm_downloadSelectedFiles(id){
	var wrapper=$('kfm_download_wrapper');
	if(!wrapper){
		wrapper=new Element('div',{
			'id':'kfm_download_wrapper',
			'styles':{
				'display':'none'
			}
		});
		kfm.addEl(document.body,wrapper);
	}
	wrapper.empty();
	if(id)kfm_downloadSelectedFiles_addIframe(wrapper,id);
	else for(var i=0;i<selectedFiles.length;++i)kfm_downloadSelectedFiles_addIframe(wrapper,selectedFiles[i]);
}
function kfm_downloadSelectedFiles_addIframe(wrapper,id){
	var iframe=new Element('iframe');
	iframe.src='get.php?id='+id+'&forcedownload=1';
	kfm.addEl(wrapper,iframe);
}
function kfm_extractZippedFile(id){
	x_kfm_extractZippedFile(id,kfm_refreshFiles);
}
function kfm_isFileInCWD(filename){
	var i,files=$('kfm_right_column').fileids;
	for(i=0;i<files.length;++i)if(files[i]==filename)return true;
	return false;
}
function kfm_incrementalFileDisplay(){
	var b=window.kfm_incrementalFileDisplay_vars,a=b.at,fsdata=b.data.files,wrapper=$('kfm_right_column'),fdata=fsdata[a];
	if(wrapper.contentMode!='file_icons')return (window.kfm_incrementalFileDisplay_vars=null);
	var name=fdata.name,ext=name.replace(kfm_regexps.all_up_to_last_dot,''),b,fullfilename=kfm_cwd_name+'/'+name,id=fdata.id;
	var nameEl=(new Element('span',{
		'class':'filename'
	})).setHTML(name);
	var el=new Element('div',{
		'id':'kfm_file_icon_'+id,
		'class':'kfm_file_icon kfm_icontype_'+ext,
		'styles':{
			'cursor':(browser.isIE?'hand':'pointer')
		}
	});
	var writable=fdata.writable;
	{ // add events
		el.addEvent('click',kfm_toggleSelectedFile);
		el.addEvent('dblclick',kfm_chooseFile);
		el.addEvent('contextmenu',kfm_file_bits.contextmenu);
		el.addEvent('mousedown',kfm_file_bits.mousedown);
		el.addEvent('mouseover',function(){ // initialise info tooltip
			if(window.kfm_tooltipInit)$clear(window.kfm_tooltipInit);
			if(window.drag_wrapper)return; // don't open if currently dragging files
			window.kfm_tooltipInit=setTimeout('x_kfm_getFileDetails('+id+',kfm_showToolTip)',500);
		});
		el.addEvent('mouseout',function(){ // remove info tooltip
			if(window.kfm_tooltipInit)$clear(window.kfm_tooltipInit);
			var o=$('kfm_tooltip');
			if(o)o.remove();
		});
	}
	{ // file attributes
		el.kfm_attributes=fdata;
		if(fdata.width){
			var url='get.php?id='+id+'&width=64&height=64&r'+Math.random();
			var img=new Element('img',{
				src:url,
				styles:{
					width:1,
					height:1
				},
				events:{
					'load':function(){
						var p=this.parentNode;
						p.setStyles('background-image:url("'+url+'")');
						this.remove();
					}
				}
			});
			kfm.addEl(el,img);
		}
		wrapper.files[a]=el;
	}
	kfm.addEl(wrapper,el);
	var reqWidth=el.offsetWidth;
	el.appendChild(nameEl);
	el.style.width='auto';
	if(el.offsetWidth>reqWidth){
		var extension='';
		if(name.indexOf('.')>-1){
			extension=name.replace(kfm_regexps.get_filename_extension,'$1');
			name=name.replace(kfm_regexps.remove_filename_extension,'')+'.';
		}
		var nameEl=$(el.getElementsByTagName('span')[0]);
		nameEl.removeClass('filename');
		kfm_shrinkName(name,el,nameEl,'offsetWidth',reqWidth,extension);
	}
	el.style.width=reqWidth-kfm_file_bits.padding;
	if(el.offsetWidth!=reqWidth){ // padding is causing an error in width
		kfm_file_bits.padding=el.offsetWidth-reqWidth;
		el.style.width=reqWidth-kfm_file_bits.padding;
	}
	window.kfm_incrementalFileDisplay_vars.at=a+1;
	if(a+1<fsdata.length)window.kfm_incrementalFileDisplay_loader=setTimeout('kfm_incrementalFileDisplay()',((a+1)%kfm_show_files_in_groups_of?0:1));
}
function kfm_refreshFiles(res){
	if(window.kfm_incrementalFileDisplay_loader){
		$clear(window.kfm_incrementalFileDisplay_loader);
		window.kfm_incrementalFileDisplay_vars=null;
	}
	kfm_selectNone();
	if(!res)return;
	if(res.toString()===res)return kfm_log(res);
	window.kfm_incrementalFileDisplay_vars={at:0,data:res};
	var a=0,wrapper=$('kfm_right_column').empty();
	$extend(wrapper,{contentMode:'file_icons',fileids:[],files:[]});
	kfm.addEl(wrapper,(new Element('div',{
		'class':'kfm_panel_header'
	})).setHTML(kfm.lang.CurrentWorkingDir(res.reqdir)));
	for(;a<res.files.length;++a)wrapper.fileids[a]=res.files[a].id;
	document.title=res.reqdir;
	kfm_lastClicked=null;
	kfm_log(kfm.lang.FilesRefreshed);
	if(res.uploads_allowed)kfm_addPanel('kfm_left_column','kfm_file_upload_panel');
	else kfm_removePanel('kfm_left_column','kfm_file_upload_panel');
	kfm_refreshPanels('kfm_left_column');
	if(!res.files.length)kfm.addEl(wrapper,(new Element('span',{
		'class':'kfm_empty'
	})).setHTML(kfm.lang.DirEmpty(res.reqdir)));
	else kfm_incrementalFileDisplay();
}
function kfm_removeFilesFromView(files){
	kfm_selectNone();
	if(files.toString()===files)return kfm_log(files);
	var i=0,right_column=$('kfm_right_column');
	for(var i=0;i<files.length;++i){
		var el=$('kfm_file_icon_'+files[i]);
		if(el)el.remove();
		right_column.fileids.remove(files[i]);
	}
}
function kfm_renameFile(id){
	var filename=$('kfm_file_icon_'+id).kfm_attributes.name;
	var newName=kfm_prompt(kfm.lang.RenameFileToWhat(filename),filename);
	if(!newName||newName==filename)return;
	kfm_filesCache[id]=null;
	kfm_log(kfm.lang.RenamedFile(filename,newName));
	x_kfm_renameFile(id,newName,kfm_refreshFiles);
}
function kfm_renameFiles(){
	var nameTemplate='',ok=false;
	do{
		nameTemplate=kfm_prompt(kfm.lang.HowWouldYouLikeToRenameTheseFiles,nameTemplate);
		var asterisks=nameTemplate.replace(/[^*]/g,'').length;
		if(!nameTemplate)return;
		if(!/\*/.test(nameTemplate))alert(kfm.lang.YouMustPlaceTheWildcard);
		else if(/\*[^*]+\*/.test(nameTemplate))alert(kfm.lang.IfYouUseMultipleWildcards);
		else if(asterisks<(''+selectedFiles.length).length)alert(kfm.lang.YouNeedMoreThan(asterisks,selectedFiles.length));
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
	var body=$E('#kfm_file_details_panel div.kfm_panel_body').empty();
	if(!res){
		body.innerHTML=kfm.lang.NoFilesSelected;
		return;
	}
	var table=kfm_buildFileDetailsTable(res);
	kfm.addEl(body,table);
}
function kfm_showToolTip(res){
	if(!res)return;
	var table=kfm_buildFileDetailsTable(res),icon=$('kfm_file_icon_'+res.id);
	if(!icon||contextmenu)return;
	table.id='kfm_tooltip';
	kfm.addEl(document.body,table);
	var l=getOffset(icon,'Left'),t=getOffset(icon,'Top'),w=icon.offsetWidth,h=icon.offsetHeight,ws=getWindowSize();
	l=(l+(w/2)>ws.x/2)?l-table.offsetWidth:l+w;
	table.setStyles('position:absolute;top:'+t+'px;left:'+l+'px;visibility:visible;opacity:.9');
}
function kfm_zip(){
	var name='zipped.zip',ok=false;
	do{
		name=kfm_prompt(kfm.lang.WhatFilenameDoYouWantToUse,name);
		if(!name)return;
		if(/\.zip$/.test(name))ok=true;
		else alert(kfm.lang.TheFilenameShouldEndWithN('.zip'));
	}while(!ok);
	x_kfm_zip(name,selectedFiles,kfm_refreshFiles);
}
