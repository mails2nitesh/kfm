/* begin core section */

/* define the order of the categories */
var HookCategories=["main", "view", "edit", "return"];

/* initialize arrays */
var HooksSingleReadonly={};
var HooksMultipleReadonly={};
var HooksSingleWritable={};
var HooksMultipleWritable={};

function kfm_addHook(objoriginal, properties){
	var obj=objoriginal;
	/*Write properties to object, so they can be different for each call*/
	if(properties){
		if(typeof(properties.doFunction)!="undefined"){
			if(typeof(properties.doFunction)=="function")obj.doFunction=properties.doFunction;
			if(typeof(properties.doFunction)=="string")obj.doFunction=eval('obj.'+properties.doFunction+';');
		}
		if(typeof properties.mode!="undefined")obj.mode=properties.mode;
		if(typeof(properties.title)!="undefined")obj.title=properties.title;
		if(typeof(properties.name)!="undefined")obj.name=properties.name;
		if(typeof properties.category!="undefined")obj.category=properties.category;
		if(typeof properties.writable!="undefined")obj.writable=properties.writable;
		if(typeof properties.extensions!="undefined")obj.extensions=properties.extensions;
	}
	if(typeof(obj.name)=="undefined"&&typeof(obj.title)!="undefined")obj.name=obj.title; // make sure the plugin has a name
	if(typeof(obj.category)=="undefined")obj.category=HookCategories[0]; // Without category, place in the top category
	if(obj.mode==0 || obj.mode==2){
		/*single file*/
		if(obj.writable==1 || obj.writable==2)kfm_addHookToArray(obj,"HooksSingleWritable");
		if(obj.writable==0 || obj.writable==2)kfm_addHookToArray(obj,"HooksSingleReadonly");
	}
	if(obj.mode==1 || obj.mode==2){
		/*selection of multiple files*/
		if(obj.writable==1 || obj.writable==2)kfm_addHookToArray(obj,"HooksMultipleWritable");
		if(obj.writable==0 || obj.writable==2)kfm_addHookToArray(obj,"HooksMultipleReadonly");
	}
}
function kfm_addHookToArray(obj, HooksArray){
	/* Add the hook object to the proper array */
	if(!obj.extensions)return false;
	if(typeof(obj.extensions)=="string" && obj.extensions.toLowerCase()=="all"){
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
	var tempHooks=eval(HookArray+'.'+ext); // copy the old array into a temp var
	eval(HookArray+'.'+ext+'={};'); // empty the old array
	for(var i in HookCategories){ // loop and add the new category in the right place
		//var category=HookCategories[i];
		var category=HookCategories[i];
		if(typeof(category)=='function')continue;
		if(typeof(eval('tempHooks.'+category))!="undefined")eval(HookArray+'.'+ext+'.'+category+'=tempHooks.'+category+';');
		else if(category==newCategory)eval(HookArray+'.'+ext+'.'+category+'=[];');
	}
}
function kfm_getLinks(ext,multiple,writable){
	/* initial return function 
	 * category information is lost
	 **/
	var HooksArray="";//initialize
	var hookObjects=[];
	if(multiple>1){
		ext="noextension";//extension dependensie for multiple files not supported yet
		if(writable)HooksArray="HooksMultipleWritable";
		else HooksArray="HooksMultipleReadonly";
	}else{
		if(writable)HooksArray="HooksSingleWritable";
		else HooksArray="HooksSingleReadonly";
	}
	if(eval('typeof('+HooksArray+'.all)!="undefined"')){
		/*Add the links for all extensions */
		var HookCategories=eval(HooksArray+'.all');
		for(category in HookCategories){
			if(typeof(category)=="function")continue;
			//category=HookCategories[i];
			for(var i=0;i<HookCategories[category].length;i++) 
				if(typeof(HookCategories[category][i])=="object")hookObjects.push(HookCategories[category][i]);
		}
	}
	if(typeof(eval(HooksArray+'.'+ext))=="undefined")return hookObjects;
	var HookCategories=eval(HooksArray+"['"+ext+"']");
	for(category in HookCategories){
		if(typeof(category)=="function")continue;
		//category=HookCategories[i];
		for(var i=0;i<HookCategories[category].length;i++) 
			if(typeof(HookCategories[category][i])=="object")hookObjects.push(HookCategories[category][i]);
	}
	//alert(dump(hookObjects));
	return hookObjects;
}
/*end core section*/
