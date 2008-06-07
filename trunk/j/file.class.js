function File(id,data){
};
File.prototype.getText=function(varname){
	var el=document.createElement('span');
	el.className=varname+' file_'+varname+'_'+this.id;
	this.setText(el,varname);
	if(!this.textInstances[varname])this.textInstances[varname]=[];
	this.textInstances[varname].push(el);
	return el;
};
File.prototype.initialize=function(id,data){
	this.id=id;
	this.textInstances=[];
	if(data){
		File_Instances[id]=this;
		File_setData(data,this);
	}
	else x_kfm_getFileDetails(id,File_setData);
};
File.prototype.setText=function(el,varname){
	el.empty();
	var v=$pick(this[varname],'');
	if(varname=='name'){
		if(!kfm_listview && kfm_vars.files.name_length_displayed && kfm_vars.files.name_length_displayed<v.length){
			el.title=v;
			v=v.substring(0,kfm_vars.files.name_length_displayed-3)+'...';
		}
		else if(kfm_listview && kfm_vars.files.name_length_in_list && kfm_vars.files.name_length_in_list<v.length){
			el.title=v;
			v=v.substring(0,kfm_vars.files.name_length_in_list-3)+'...';
		}
	}
	if(varname=='modified' && !v){
		var v=(new Date(this.ctime*1000)).toGMTString().replace(/ GMT$/,'');
		this.modified=v;
	}
	el.appendText(v);
};
File.prototype.setThumbnailBackground=function(el,reset){
	if(this.icon_loaded && !reset)el.style.backgroundImage='url("'+this.icon_url+'")';
	else{
		var url='get.php?id='+this.id+'&width=64&height=64&get_params='+kfm_vars.get_params+'&r'+Math.random();
		var img=document.createElement('img');
		img.src=url;
		img.style.width=1;
		img.style.height=1;
		var id=this.id;
		img.addEvent('load',function(){
			var p=this.parentNode;
			p.style.backgroundImage='url("'+url+'")';
			var F=File_getInstance(id);
			F.icon_loaded=1;
			F.icon_url=url;
			this.remove();
		});
		kfm.addEl(el,img);
	}
};
function File_getInstance(id,data){
	id=parseInt(id);
	if(isNaN(id))return;
	if(!File_Instances[id] || data){
		File_Instances[id]=new File();
		File_Instances[id].initialize(id,data);
	}
	return File_Instances[id];
}
function File_setData(el,F){
	var id=+el.id;
	if(!F)F=File_getInstance(id);
	$each(el,function(varvalue,varname){
		F[varname]=el[varname];
		if(!F.textInstances || !F.textInstances[varname])return;
		F.textInstances[varname].each(function(t){
			F.setText(t,varname);
		});
	});
	File_Instances[id]=F;
}
var File_Instances=[];
