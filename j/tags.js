// see license.txt for licensing
function kfm_tagAdd(id){
	var newTag=kfm_prompt('What is the new tag?\nFor multiple tags, separate by commas.'); // TODO: new string
	if(newTag){
		files=selectedFiles.length?selectedFiles:id;
		x_kfm_tagAdd(files,newTag,kfm_showFileDetails);
	}
}
function kfm_tagDraw(id){
	if(!isArray(id)){
		if(kfm_tags[id]){
			return newEl('span',0,0,kfm_tags[id]);
		}
		else{
			x_kfm_getTagName(id,kfm_tagDraw);
			return newEl('span',0,'kfm_unknown_tag',id);
		}
	}
	var name=id[1],id=id[0];
	var els=getElsWithClass('kfm_unknown_tag','span');
	kfm_tags[id]=name;
	for(var i=0;i<els.length;++i){
		var el=els[i];
		if(el.innerHTML==id){
			el.innerHTML=name;
			el.delClass('kfm_unknown_tag');
		}
	}
}
