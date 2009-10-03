window.kfm_chooseFile=function(){
	if(selectedFiles.length>1 && !kfm_vars.files.allow_multiple_returns)return kfm.alert(_("error: you cannot choose more than one file at a time"));
	x_kfm_getFileUrls(selectedFiles,function(urls){
		if(copy_to_clipboard)copy_to_clipboard(urls.join("\n"));
		if(!window.opener || kfm_file_handler=='download'){
			for(var i=0;i<urls.length;++i){
				var url=urls[i];
				if(/get.php/.test(url))url+='&forcedownload=1';
				document.location=url;
			}
			return;
		}
		if(selectedFiles.length==1&&File_getInstance(selectedFiles[0]).width)window.SetUrl(urls[0].replace(/([^:]\/)\//g,'$1'),0,0,File_getInstance(selectedFiles[0]).caption);
		else{
			if(selectedFiles.length==1)window.SetUrl(urls[0]);
			else window.SetUrl('"'+urls.join('","')+'"');
		}
		setTimeout('window.close()',1);
	});
}
window.SetUrl=function(file_url,b,c,caption){
	// { FCKeditor
	if(window.opener.SetUrl)return window.opener.SetUrl(fiile_url,b,c,caption);
	// }
	// { CKEditor
	if(window.opener.CKEDITOR){
		var funcnum=document.location.toString().replace(/.*CKEditorFuncNum=([0-9]*)[^0-9].*/,'$1');
		window.opener.CKEDITOR.tools.callFunction(funcnum,file_url);
	}
}
