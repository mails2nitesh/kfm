// see license.txt for licensing
function kfm_createEmptyFile(){
	var filename='newfile.txt',msg='';
	do{
		var not_ok=0;
		filename=kfm_prompt(kfm_lang.WhatFilenameToCreateAs+msg,filename);
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
	x_kfm_createEmptyFile(filename,kfm_refreshFiles);
}
function kfm_disableLeftColumn(){
	var left_column=$('kfm_left_column'),blocker=newEl('div','kfm_left_column_hider');
	blocker.setCss('position:absolute;left:0;top:0;width:'+left_column.offsetWidth+'px;height:'+left_column.offsetHeight+'px;opacity:.7;background:#fff');
	document.body.addEl(blocker);
}
function kfm_editTextFile(id){
	x_kfm_getTextFile(id,kfm_showTextFile);
}
function kfm_showTextFile(res){
	if(!$('kfm_left_column_hider'))kfm_disableLeftColumn();
	var t=newEl('table','kfm_editFileTable').setCss('height:100%;width:100%');
	var r2=t.addRow();
	r2.addCell(0,1,res.name);
	r2.addCell(1,1,newLink('javascript:delEl("kfm_left_column_hider");x_kfm_viewTextFile('+res.id+',kfm_viewTextFile)','View',0,'button'));
	r2.addCell(2,1,newLink('javascript:delEl("kfm_left_column_hider");kfm_setMessage("saving file...");$("codepress-ondemand").value=CodePress.getCode();x_kfm_saveTextFile('+res.id+',$("codepress-ondemand").value,kfm_clearMessage);','Save',0,'button'));
	r2.addCell(3,1,newLink('javascript:if($("codepress-ondemand").value==CodePress.getCode() || confirm( kfm_lang.CloseWithoutSavingQuestion)){delEl("kfm_left_column_hider");x_kfm_loadFiles(kfm_cwd_id,kfm_refreshFiles);}',kfm_lang.Close,0,'button'));
	r3=t.addRow().setCss('height:100%').addCell(0,4);
	r3.innerHTML = '<iframe id="codepress" src="codepress/codepress.php" width="100%" height="100%"></iframe><textarea id="codepress-ondemand" name="codepress-ondemand" style="display:none" lang="'+res.lang+'"></textarea>';
	$('kfm_right_column').empty().addEl(t);
	$('codepress-ondemand').value = res.content;
	setTimeout("CodePressLoadCode()",1000);
}
function CodePressLoadCode(){
	CodePress.setCode('codepress-ondemand');
}
function kfm_viewTextFile(res){
	var t=newEl('table','kfm_viewFileTable').setCss('height:100%;width:100%');
	var r=t.addRow(),c=0,wrapper=newEl('div').setCss('overflow:auto;width:100%;height:100%');
	r.addCell(c++,1,res.name);
	if(res.buttons_to_show&2)r.addCell(c++,1,newLink('javascript:kfm_editTextFile('+res.id+')','Edit',0,'button'));
	if(res.buttons_to_show&1)r.addCell(c++,1,newLink('javascript:x_kfm_loadFiles(kfm_cwd_id,kfm_refreshFiles);',kfm_lang.Close,0,'button'));
	var cell=t.addRow().setCss('height:100%;').addCell(0,c).addEl(wrapper);
	wrapper.innerHTML=res.content;
	$('kfm_right_column').empty().addEl(t);
}
