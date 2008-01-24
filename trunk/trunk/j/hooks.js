/* begin core section */

/* define the order of the categories */
var HookCategories=["main", "view", "edit", "return"];

var kfm_imageExtensions=['jpg','png','gif'];
/* initialize arrays */
var HooksSingleReadonly={};
//var HooksMultipleReadonly={};
var HooksSingleWritable={};
//var HooksMultipleWritable={};
var HooksMultiple={};
function kfm_addHook(objoriginal, properties){
	var obj=objoriginal;
	/*Write properties to object, so they can be different for each call*/
	if(properties){
		if(typeof(properties.doFunction)!="undefined"){
			if(typeof(properties.doFunction)=="function")obj.doFunction=properties.doFunction;
			if(typeof(properties.doFunction)=="string")obj.doFunction=eval('obj.'+properties.doFunction+';');
		}
		if(typeof(properties.mode)!="undefined")obj.mode=properties.mode;
		if(typeof(properties.title)!="undefined")obj.title=properties.title;
		if(typeof(properties.name)!="undefined")obj.name=properties.name;
		if(typeof(properties.category)!="undefined")obj.category=properties.category;
		if(typeof(properties.writable)!="undefined")obj.writable=properties.writable;
		if(typeof(properties.extensions)!="undefined")obj.extensions=properties.extensions;
	}
	if(typeof(obj.name)=="undefined"&&typeof(obj.title)!="undefined")obj.name=obj.title; // make sure the plugin has a name
	if(typeof(obj.category)=="undefined")obj.category=HookCategories[0]; // Without category, place in the top category
	if(!obj.extensions)obj.extensions="all";

	if(!kfm_vars.permissions.file.ed && obj.category=='edit')return;
	if(!kfm_vars.permissions.image.manip && obj.category=='edit'){
		if(obj.extensions=='all')return;
		for(var i=0; i<obj.extensions.length; i++){
			for(var j=0; j<kfm_imageExtensions; j++){
				if(obj.extensions[i]==kfm_imageExtensions[j]){
					obj.extensions.splice(i,1);
					return;
				}
			}
		}
	}

	if(obj.mode==0 || obj.mode==2){
		/*single file*/
		if(obj.writable==1 || obj.writable==2)kfm_addHookToArray(obj,"HooksSingleWritable");
		if(obj.writable==0 || obj.writable==2)kfm_addHookToArray(obj,"HooksSingleReadonly");
	}
	if(obj.mode==1 || obj.mode==2){
		/*selection of multiple files*/
		kfm_addHookToArray(obj,"HooksMultiple");
		//if(obj.writable==1 || obj.writable==2)kfm_addHookToArray(obj,"HooksMultipleWritable");
		//if(obj.writable==0 || obj.writable==2)kfm_addHookToArray(obj,"HooksMultipleReadonly");
	}
}
function kfm_addHookToArray(obj, HooksArray){
	/* Add the hook object to the proper array */
	if(!obj.extensions)return false;
	if(typeof(obj.extensions)=="string" && obj.extensions.toLowerCase()=="all" || HooksArray=="HooksMultiple"){
		ext="all";
		if(eval("typeof("+HooksArray+'.'+ext+')=="undefined"'))kfm_addHookExtension(HooksArray, ext);
		if(eval("typeof("+HooksArray+'.'+ext+'.'+obj.category+')=="undefined"'))kfm_addHookCategory(HooksArray, ext, obj.category);
		eval(HooksArray+'.'+ext+'.'+obj.category+'.push(obj);');
	}else{
		for(var i=0;i<obj.extensions.length; i++){
			ext=obj.extensions[i];
			/*
			//if(typeof(ext)!="string") continue; // probably mootools issue
			if(eval("typeof("+HooksArray+"['"+ext+"'])=='undefined'"))kfm_addHookExtension(HooksArray, ext);
			//if(typeof eval(HooksArray+"['"+ext+"']['"+obj.category+"']")=="undefined")kfm_addHookCategory(HooksArray, ext, obj.category);
			if(eval("typeof("+HooksArray+'["'+ext+'"]["'+obj.category+'"])=="undefined"'))kfm_addHookCategory(HooksArray, ext, obj.category);
			eval(HooksArray+'["'+ext+'"]["'+obj.category+'"].push(obj);');
			*/
			if(eval("typeof("+HooksArray+'.'+ext+')=="undefined"'))kfm_addHookExtension(HooksArray, ext);
			if(eval("typeof("+HooksArray+'.'+ext+'.'+obj.category+')=="undefined"'))kfm_addHookCategory(HooksArray, ext, obj.category);
			eval(HooksArray+'.'+ext+'.'+obj.category+'.push(obj);');
		}
	}
}
function kfm_addHookExtension(HooksArray, ext){
	eval(HooksArray+'.'+ext+'={};');
}
function kfm_addHookCategory(HookArray,ext, newCategory){
	/*Add a hook category and make sure the order defined in the HookCategories is maintained*/
	eval(HookArray+'.'+ext+'.'+newCategory+'=[];');

	/*Sorting according to the HookCategories */
	//Not working yet
	/*
	var tempHooks=eval(HookArray+'.'+ext); // copy the old array into a temp var
	eval(HookArray+'.'+ext+'={};'); // empty the old array
	for(var i in HookCategories){ // loop and add the new category in the right place
		//var category=HookCategories[i];
		var category=HookCategories[i];
		if(typeof(category)=='function')continue;
		if(typeof(eval('tempHooks.'+category))!="undefined")eval(HookArray+'.'+ext+'.'+category+'=tempHooks.'+category+';');
		else if(category==newCategory)eval(HookArray+'.'+ext+'.'+category+'=[];');
	}
	*/
}
function kfm_getLinks(files){
	/* initial return function 
	 * category information is lost
	 * 
	 **/
	var HooksArray="";//initialize
	var hookObjects=[];

	/* multiple file section */
	var cPlugins=[];
	function addPlugin(plugin, fid){
		var add=true;
		/* determine index and add plugin if is not present */
		var index=-1;
		for(var i=0;i<cPlugins.length;i++){
			if(cPlugins[i].name==plugin.name){
				add=false;
				index=i;
				break;
			}
		}
		if(add){
			cPlugins.push(plugin);
			index=cPlugins.length-1;
			cPlugins[index].doParameter=[];
		}
	
		/* Then add the file id to the doParameter */
		cPlugins[index].doParameter.push(fid);
		
		/* Make sure a file is only added once, maybe not required */
		/*
		var addFile=true;
		for(var j=0;j<cPlugins[index].doParameter.length;j++) if(cPlugins[index].doParameter[j]==fid)addFile=false;
		if(addFile)cPlugins[index].doParameter.push(fid);
		*/
	}
	if(files.length>1){
		for(var i=0; i<files.length; i++){
			var F=File_getInstance(files[i]);
         var extension=F.name.replace(/.*\./,'').toLowerCase();
			/*
			for(var category in HooksMultiple.all){ //loop over categories
				if(typeof(category)=="function")continue; // mootools fix
				var plugins=eval("HooksMultiple.all."+category);
				for(var j=0; j<plugins.length; j++){ // loop over plugins
					var plugin=plugins[j];
					if(	F.writable && 
							(plugin.writable==1 || plugin.writable==2) && 
							((typeof(plugin.extensions)=="string" && plugin.extensions=="all") || plugin.extensions.indexOf(extension)!=-1)
						)
						addPlugin(plugin,F.id);
					if(	!F.writable && 
							(plugin.writable==0 || plugin.writable==2) && 
							((typeof(plugin.extensions)=="string" && plugin.extensions=="all") || plugin.extensions.indexOf(extension)!=-1)
						)
						addPlugin(plugin,F.id);
				}
			}*/
			for(var k=0;k<HookCategories.length; k++){
				if(eval('HooksMultiple.all.'+HookCategories[k]))plugins=eval('HooksMultiple.all.'+HookCategories[k]);
				else plugins=[];
				for(var j=0; j<plugins.length; j++){ // loop over plugins
					var plugin=plugins[j];
					if(	F.writable && 
							(plugin.writable==1 || plugin.writable==2) && 
							((typeof(plugin.extensions)=="string" && plugin.extensions=="all") || plugin.extensions.indexOf(extension)!=-1)
						)
						addPlugin(plugin,F.id);
					else if(	!F.writable && 
							(plugin.writable==0 || plugin.writable==2) && 
							((typeof(plugin.extensions)=="string" && plugin.extensions=="all") || plugin.extensions.indexOf(extension)!=-1)
						)
						addPlugin(plugin,F.id);
				}
			}
		}
		return cPlugins;
	}

	/* single file section */
	var F=File_getInstance(files[0]);
	var ext=F.name.replace(/.*\./,'').toLowerCase();
	if(F.writable)HooksArray="HooksSingleWritable";
	else HooksArray="HooksSingleReadonly";

	/*Add the links for all extensions */
	/*
	if(eval('typeof('+HooksArray+'.all)!="undefined"')){
		var HookCategories=eval(HooksArray+'.all');
		for(category in HookCategories){
			if(typeof(category)=="function")continue; // mootools fix
			for(var i=0;i<HookCategories[category].length;i++) 
				if(typeof(HookCategories[category][i])=="object"){
					hookObjects.push(HookCategories[category][i]);
					hookObjects[hookObjects.length-1].doParameter=[F.id];
				}
		}
	}
	if(typeof(eval(HooksArray+'.'+ext))=="undefined")return hookObjects; // return if extension is not defined
	var HookCategories=eval(HooksArray+'.'+ext);
	for(category in HookCategories){
		if(typeof(category)=="function")continue; // mootools fix
		for(var i=0;i<HookCategories[category].length;i++) 
			if(typeof(HookCategories[category][i])=="object"){
				hookObjects.push(HookCategories[category][i]);
				hookObjects[hookObjects.length-1].doParameter=[F.id];
			}
	}
	*/
	for(var j=0;j<HookCategories.length;j++){
		category=HookCategories[j];
		/* extend should be concat, but mootools thinks otherwise*/
		if(typeof(eval(HooksArray+'.all.'+category))!='undefined')hookObjects.extend(eval(HooksArray+'.all.'+category));
		if(typeof(eval(HooksArray+'.'+ext+'.'+category))!='undefined')hookObjects.extend(eval(HooksArray+'.'+ext+'.'+category));
	}
	hookObjects.forEach(function(item, index){
		item.doParameter=[F.id];
	});
	return hookObjects;
}
/*end core section*/
