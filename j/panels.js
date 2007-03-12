// see license.txt for licensing
function kfm_addPanel(wrapper,panel){
	wrapper=$(wrapper);
	if(kfm_hasPanel(wrapper,panel)){
		$(panel).visible=1;
		kfm_refreshPanels(wrapper);
		return;
	}
	if     (panel=='kfm_directories_panel')el=kfm_createPanel(kfm_lang.Directories,'kfm_directories_panel',newEl('table','kfm_directories'),{state:1,abilities:-1,order:1});
	else if(panel=='kfm_directory_properties_panel')el=kfm_createPanel(kfm_lang.DirectoryProperties,'kfm_directory_properties_panel',newEl('div','kfm_directory_properties'),{state:0,abilities:1});
	else if(panel=='kfm_file_details_panel')el=kfm_createFileDetailsPanel();
	else if(panel=='kfm_file_upload_panel')el=kfm_createFileUploadPanel();
	else if(panel=='kfm_search_panel')el=kfm_createSearchPanel();
	else if(panel=='kfm_logs_panel')el=kfm_createPanel(kfm_lang.Logs,'kfm_logs_panel',newEl('p',0,0,kfm_lang.LoadingKFM),{order:100});
	else{
		kfm_log(kfm_lang.NoPanel(panel));
		return;
	}
	wrapper.panels[wrapper.panels.length]=panel;
	wrapper.addEl(el);
}
function kfm_createFileUploadPanel(){
	{ // create upload form
		var sel=newSelectbox('uploadType',[kfm_lang.Upload,kfm_lang.CopyFromURL],0,0,function(){
			var copy=parseInt(this.selectedIndex);
			$('kfm_uploadForm').setCss('display:'+(copy?'none':'block'));
			$('kfm_copyForm').setCss('display:'+(copy?'block':'none'));
		});
		{ // upload from computer
			var f1=newForm('upload.php','POST','multipart/form-data','kfm_iframe');
			f1.id='kfm_uploadForm';
			var iframe=newEl('iframe','kfm_iframe').setCss('display:none');
			iframe.src='javascript:false';
			var submit=newInput('upload','submit',kfm_lang.Upload);
			submit.onclick=function(){
				setTimeout('$("kfm_file").type="text";$("kfm_file").type="file"',1);
			};
			var input=newInput('kfm_file','file');
			input.onkeyup=kfm_cancelEvent;
			f1.addEl([input,submit]);
		}
		{ // copy from URL
			var f2=newEl('div','kfm_copyForm');
			f2.setCss('display:none');
			var submit2=newInput('upload','submit',kfm_lang.CopyFromURL);
			var inp2=newInput('kfm_url');
			inp2.setCss('width:100%');
			submit2.onclick=kfm_downloadFileFromUrl;
			f2.addEl([inp2,submit2]);
		}
	}
	return kfm_createPanel(kfm_lang.FileUpload,'kfm_file_upload_panel',[sel,f1,iframe,f2],{maxedState:3,state:3,order:2});
}
function kfm_createFileDetailsPanel(){
	return kfm_createPanel(kfm_lang.FileDetails,'kfm_file_details_panel',0,{abilities:1,order:4});
}
function kfm_createPanel(title,id,subels,vars){
	// states:    0=minimised,1=maximised,2=fixed-height, 3=fixed-height-maxed
	// abilities: -1=disabled,0=not closable,1=closable
	var el=X(newEl('div',id,'kfm_panel',[newEl('div',0,'kfm_panel_header',title),newEl('div',0,'kfm_panel_body',subels)]),{
		state:0,height:0,panel_title:title,abilities:0,visible:1,order:99,
		addCloseButton:function(){if(this.abilities&1)this.addButton('removePanel','','x',kfm_lang.Close)},
		addMaxButton:function(){this.addButton('maximisePanel','','M',kfm_lang.Maximise)},
		addMinButton:function(){this.addButton('minimisePanel','','_',kfm_lang.Minimise)},
		addMoveDownButton:function(){if(this.id!=this.parentNode.panels[this.parentNode.panels.length-1])this.addButton('movePanel',',1','d',kfm_lang.MoveDown)},
		addMoveUpButton:function(){if(this.id!=this.parentNode.panels[0])this.addButton('movePanel',',-1','u',kfm_lang.MoveUp)},
		addRestoreButton:function(){this.addButton('restorePanel','','r',kfm_lang.Restore)},
		addButton:function(f,p,b,t){
			if(this.abilities==-1)return;
			getElsWithClass('kfm_panel_header','DIV',this)[0].addEl(
				newLink('javascript:kfm_'+f+'("'+this.parentNode.id+'","'+this.id+'"'+p+')','['+b+']',0,'kfm_panel_header_'+b,t)
			);
		}
	});
	if(vars)el=X(el,vars);
	return el;
}
function kfm_createPanelWrapper(name){
	var el=newEl('div',name,'kfm_panel_wrapper');
	el.panels=[];
	return el;
}
function kfm_createSearchPanel(){
	var t=newEl('table','kfm_search_table'),r,inp,rows=0;
	{ // filename
		r=t.insertRow(rows++);
		r.insertCell(0).appendChild(newText(kfm_lang.Filename));
		inp=newInput('kfm_search_keywords');
		inp.onkeyup=kfm_runSearch;
		r.insertCell(1).appendChild(inp);
	}
	{ // tags
		r=t.insertRow(rows++);
		r.insertCell(0).appendChild(newText(kfm_lang.Tags));
		inp=newInput('kfm_search_tags');
		inp.title=kfm_lang.CommaSeparated;
		inp.onkeyup=kfm_runSearch;
		r.insertCell(1).appendChild(inp);
	}
	return kfm_createPanel(kfm_lang.Search,'kfm_search_panel',t,{maxedState:3,state:3,order:3});
}
function kfm_hasPanel(wrapper,panel){
	for(var i in wrapper.panels)if(wrapper.panels[i]==panel)return true;
	return false;
}
function kfm_minimisePanel(wrapper,panel){
	$(panel).state=0;
	kfm_refreshPanels($(wrapper));
}
function kfm_maximisePanel(wrapper,panel){
	wrapper=$(wrapper);
	var p=$(panel);
	p.state=p.maxedState==3?3:1;
	kfm_refreshPanels($(wrapper));
}
function kfm_movePanel(wrapper,panel,offset){
	wrapper=$(wrapper);
	var i=0,j,k;
	for(;i<wrapper.panels.length;++i)if(wrapper.panels[i]==panel)j=i;
	if(offset<0)--j;
	k=wrapper.panels[j];
	wrapper.panels[j]=wrapper.panels[j+1];
	wrapper.panels[j+1]=k;
	wrapper.insertBefore($(wrapper.panels[j]),$(wrapper.panels[j+1]));
	kfm_refreshPanels(wrapper);
}
function kfm_refreshPanels(wrapper){
	wrapper=$(wrapper);
	var ps=wrapper.panels,i,minheight=0;
	var minimised=[],maximised=[],fixed_height=[],fixed_height_maxed=[];
	for(i in ps){
		var el=$(ps[i]);
		if(inArray(el.id,kfm_hidden_panels))el.visible=false;
		if(el.visible){
			el.minheight=getElsWithClass('kfm_panel_header','DIV',el.setCss('display:block'))[0].offsetHeight;
			minheight+=el.minheight;
			switch(el.state){
				case 0: minimised[minimised.length]=ps[i]; break;
				case 1: maximised[maximised.length]=ps[i]; break;
				case 2: fixed_height[fixed_height.length]=ps[i]; break;
				case 3: fixed_height_maxed[fixed_height_maxed.length]=ps[i]; break;
				default: kfm_log(kfm_lang.UnknownPanelState+el.state);
			}
		}
		else el.setCss('display:none');
	}
	var height=wrapper.offsetHeight;
	for(i in minimised){
		var n=minimised[i];
		var el=$(n);
		getElsWithClass('kfm_panel_body','DIV',el)[0].setCss('display:none');
		var head=getElsWithClass('kfm_panel_header','DIV',el)[0].empty(),els=[];
		if(wrapper.panels_unlocked){
			el.addCloseButton();
			el.addMaxButton();
			el.addMoveDownButton();
			el.addMoveUpButton();
		}
		els[els.length]=el.panel_title;
		head.addEl(els);
	}
	for(i in fixed_height){
		var n=fixed_height[i];
		var el=$(n)
		getElsWithClass('kfm_panel_body','DIV',el)[0].setCss('height:'+el.height+'px;display:block');
		minheight+=el.height;
		var head=getElsWithClass('kfm_panel_header','DIV',el)[0].empty(),els=[];
		if(wrapper.panels_unlocked){
			el.addCloseButton();
			el.addMaxButton();
			el.addMinButton();
			el.addMoveDownButton();
			el.addMoveUpButton();
		}
		els[els.length]=el.panel_title;
		head.addEl(els);
	}
	for(i in fixed_height_maxed){
		var n=fixed_height_maxed[i];
		var el=$(n),body=getElsWithClass('kfm_panel_body','DIV',el)[0].setCss('height:auto;display:block');
		minheight+=body.offsetHeight;
		var head=getElsWithClass('kfm_panel_header','DIV',el)[0].empty(),els=[];
		if(wrapper.panels_unlocked){
			el.addCloseButton();
			el.addMinButton();
			el.addMoveDownButton();
			el.addMoveUpButton();
		}
		els[els.length]=el.panel_title;
		head.addEl(els);
	}
	if(maximised.length)var size=(height-minheight)/maximised.length;
	for(i in maximised){
		var n=maximised[i];
		var el=$(n)
		getElsWithClass('kfm_panel_body','DIV',el)[0].setCss('height:'+size+'px;display:block');
		var head=getElsWithClass('kfm_panel_header','DIV',el)[0].empty(),els=[];
		if(wrapper.panels_unlocked){
			el.addCloseButton();
			el.addRestoreButton();
			el.addMinButton();
			el.addMoveDownButton();
			el.addMoveUpButton();
		}
		els[els.length]=el.panel_title;
		head.addEl(els);
	}
	{ // fix order of panels
		do{
			var els=getElsWithClass('kfm_panel','DIV',wrapper),arr=[],found=0,prev=0;
			for(var i=0;i<els.length,!found,els[i];++i){
				var order=els[i].order;
				if(order<prev&&i){
					wrapper.insertBefore(els[i],els[i-1]);
					found=1;
				}
				prev=order;
			}
		}while(found);
		for(i in els)arr.push(els[i].order);
	}
}
function kfm_removePanel(wrapper,panel){
	var panel=$(panel);
	if(!panel)return;
	$(panel).visible=0;
	kfm_refreshPanels(wrapper);
}
function kfm_restorePanel(wrapper,panel){
	wrapper=$(wrapper);
	var p=$(panel);
	p.state=2;
	if(!p.height)p.height=getElsWithClass('kfm_panel_body','DIV',p)[0].offsetHeight;
	kfm_refreshPanels(wrapper);
}
function kfm_togglePanelsUnlocked(){
	$('kfm_left_column').panels_unlocked=1-$('kfm_left_column').panels_unlocked;
	kfm_refreshPanels('kfm_left_column');
}
