// see ../license.txt for licensing
function kfm_createEmptyFile(){
	var filename='newfile.txt',msg='';
	do{
		var not_ok=0;
		filename=kfm_prompt(kfm.lang.WhatFilenameToCreateAs+msg,filename);
		if(!filename)return;
		if(kfm_isFileInCWD(filename)){
			var o=kfm.confirm(kfm.lang.AskIfOverwrite(filename));
			if(!o)not_ok=1;
		}
		if(filename.indexOf('/')>-1){
			msg=kfm.lang.NoForwardslash;
			not_ok=1;
		}
	}while(not_ok);
	x_kfm_createEmptyFile(kfm_cwd_id,filename,kfm_refreshFiles);
}
function kfm_disableLeftColumn(){
	var left_column=$('kfm_left_column');
	kfm.addEl(document.body,new Element('div',{
		'id':'kfm_left_column_hider',
		'styles':{
			'position':'absolute',
			'left':0,
			'top':0,
			'width':left_column.offsetWidth,
			'height':left_column.offsetHeight,
			'opacity':'.7',
			'background':'#fff'
		}
	}));
}
function kfm_showTextFile(res){
	if(!$('kfm_left_column_hider'))kfm_disableLeftColumn();
	var t=new Element('table',{
		'id':'kfm_editFileTable',
		'styles':{
			'height':'100%',
			'width':'100%'
		}
	});
	var right_column=$('kfm_right_column').empty();
	right_column.addEvent('keyup',kfm_textfile_keybinding);
	right_column.contentMode='codepress';
	kfm.addEl(right_column,t);
	var r2=kfm.addRow(t),c=0;
	kfm.addCell(r2,c++,1,res.name);
	kfm.addCell(r2,c++,1,newLink('javascript:new Notice("saving file...");$("edit-start").value=codepress.getCode();x_kfm_saveTextFile('+res.id+',$("edit-start").value,kfm_showMessage);','Save',0,'button'));
	kfm.addCell(r2,c++,1,newLink('javascript:kfm_textfile_close()',kfm.lang.Close,0,'button'));
	var row=$(kfm.addRow(t));
	row.setStyle('height','100%');
	r3=kfm.addCell(row,0,c);
	r3.id='kfm_codepressTableCell';
	var codeEl=new Element('textarea',{
		'id':'codepress',
		'class':'codepress '+res.language,
		'value':res.content,
		'title':res.name,
		'styles':{
			'width':'100%',
			'height':r3.offsetHeight-2
		}
	});
	changeCheckEl=newInput('edit-start','textarea',res.content);
	changeCheckEl.setStyle('display','none');
	r3.appendChild(codeEl);
	r3.appendChild(changeCheckEl);
	if(window.CodePress)kfm_textfile_createEditor();
	else loadJS('codepress-0.9.5/codepress.js','cp-script','en-us','kfm_textfile_createEditor();');
}
function kfm_viewTextFile(res){
	var right_column=$('kfm_right_column').empty();
	right_column.contentMode='viewtext';
	var t=new Element('table',{
		'id':'kfm_viewFileTable',
		'styles':{
			'height':right_column.offsetHeight,
			'width':right_column.offsetWidth-2
		}
	});
	var r=kfm.addRow(t),c=0;
	kfm.addCell(r,c++,1,res.name);
	if(res.buttons_to_show&2)kfm.addCell(r,c++,1,newLink('javascript:x_kfm_getTextFile('+res.id+',kfm_showTextFile)','Edit',0,'button'));
	if(res.buttons_to_show&1)kfm.addCell(r,c++,1,newLink('javascript:x_kfm_loadFiles(kfm_cwd_id,kfm_refreshFiles);',kfm.lang.Close,0,'button'));
	kfm.addEl(right_column,t);
	var textCell=kfm.addEl(kfm.addCell(kfm.addRow(t).setStyles('height:100%'),0,c),'please wait...');
	var wrapper=new Element('div',{
		'styles':{
			'overflow':'auto',
			'height':textCell.offsetHeight-2,
			'width':textCell.offsetWidth
		}
	});
	kfm.addEl(textCell.empty(),wrapper);
	wrapper.innerHTML=res.content;
}
function kfm_textfile_close(){
	if($("edit-start").value!=codepress.getCode() && !kfm.confirm( kfm.lang.CloseWithoutSavingQuestion))return;
	if($("kfm_left_column_hider"))$("kfm_left_column_hider").remove();
	kfm_changeDirectory("kfm_directory_icon_"+kfm_cwd_id);
	$('kfm_right_column').removeEvent('keyup',kfm_textfile_keybinding);
}
function kfm_textfile_keybinding(e){
	window.title=Math.random();
	e=new Event(e);
	if(e.code!=27)return;
	e.stopPropagation();
	kfm_textfile_close();
}
function kfm_textfile_createEditor(){
	CodePress.run();
	if($("kfm_tooltip"))$("kfm_tooltip").remove();
	kfm_textfile_attachKeyBinding();
}
function kfm_textfile_attachKeyBinding(){
	if(!codepress.editor||!codepress.editor.body)return setTimeout('kfm_textfile_attachKeyBinding();',1);
	var doc=codepress.contentWindow.document;
	if(doc.attachEvent)doc.attachEvent('onkeypress',kfm_textfile_keybinding);
	else doc.addEventListener('keypress',kfm_textfile_keybinding,false);
}
