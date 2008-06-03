function kfm_plugin_tags(){
	this.name='tags';
	this.title='tags Plugin'; //will be set dynamically
	this.category='edit';
	this.mode=0;
	this.writable=2;
	this.extensions='all';
	this.doFunction=function(files){alert('Tags doFunction is not set')};
}
kfm_addHook(new kfm_plugin_tags(),{name:'tags_add',title:kfm.lang.AddTagsToFiles,doFunction:function(files){kfm_tagAdd(files[0])}});
kfm_addHook(new kfm_plugin_tags(),{name:'tags_remove',title:kfm.lang.RemoveTagsToFiles,doFunction:function(files){kfm_tagRemove(files[0])}});

function kfm_tagAdd(id){
	kfm_prompt(kfm.lang.WhatIsTheNewTag,'',function(newTag){
		if(newTag){
			files=selectedFiles.length?selectedFiles:id;
			x_kfm_tagAdd(files,newTag,kfm_showFileDetails);
		}
	});
}
function kfm_tagDraw(id){
	if($type(id)!='array'){
		if(kfm_tags[id])return (new Element('span')).setHTML(kfm_tags[id]);
		x_kfm_getTagName(id,kfm_tagDraw);
		return (new Element('span',{
			'class':'kfm_unknown_tag'
		})).setHTML(id);
	}
	var name=id[1],id=id[0],els=$ES('span.kfm_unknown_tag');
	kfm_tags[id]=name;
	for(var i=0;i<els.length;++i){
		var el=els[i];
		if(el.innerHTML==id){
			el.innerHTML=name;
			el.removeClass('kfm_unknown_tag');
		}
	}
}
function kfm_tagRemove(id){
	kfm_prompt(kfm.lang.WhichTagsDoYouWantToRemove,'',function(tagsToRemove){
		if(tagsToRemove){
			files=selectedFiles.length?selectedFiles:id;
			x_kfm_tagRemove(files,tagsToRemove,kfm_showFileDetails);
		}
	});
}
