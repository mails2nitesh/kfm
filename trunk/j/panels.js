// see license.txt for licensing
function kfm_addPanel(wrapper,panel){
	wrapper=$(wrapper);
	if(kfm_hasPanel(wrapper,panel)){
		$(panel).visible=1;
		kfm_refreshPanels(wrapper);
		return;
	}
	if(panel=='kfm_directories_panel')el=kfm_createPanel(
		kfm_lang.Directories,
		'kfm_directories_panel',
		new Element('table',{
			'id':'kfm_directories'
		}),
		{'state':1,'abilities':-1,'order':1}
	);
	else if(panel=='kfm_directory_properties_panel')el=kfm_createPanel(
		kfm_lang.DirectoryProperties,
		'kfm_directory_properties_panel',
		new Element('div',{
			'class':'kfm_directory_properties'
		}),
		{state:0,abilities:1}
	);
	else if(panel=='kfm_file_details_panel')el=kfm_createFileDetailsPanel();
	else if(panel=='kfm_file_upload_panel')el=kfm_createFileUploadPanel();
	else if(panel=='kfm_search_panel')el=kfm_createSearchPanel();
	else if(panel=='kfm_logs_panel')el=kfm_createPanel(
		kfm_lang.Logs,
		'kfm_logs_panel',
		(new Element('p')).setHTML(kfm_lang.LoadingKFM),
		{order:100}
	);
	else{
		kfm_log(kfm_lang.NoPanel(panel));
		return;
	}
	if(!wrapper.panels)wrapper.panels=[];
	wrapper.panels[wrapper.panels.length]=panel;
	kfm_addEl(wrapper,el);
}
function kfm_createFileUploadPanel(){
	{ // create form
		var kfm_uploadPanel_checkForZip=function(e){
			kfm_cancelEvent(e);
			var v=this.value;
			var h=(v.indexOf('.')==-1||v.replace(/.*(\.[^.]*)/,'$1')!='.zip');
			$('kfm_unzip1').setStyles('visibility:'+(h?'hidden':'visible'));
			$('kfm_unzip2').setStyles('visibility:'+(h?'hidden':'visible'));
		}
		var sel=newSelectbox('uploadType',[kfm_lang.Upload,kfm_lang.CopyFromURL],0,0,function(){
			var copy=parseInt(this.selectedIndex);
			var unzip1=$('kfm_unzip1'),unzip2=$('kfm_unzip2'),file=$('kfm_file'),url=$('kfm_url');
			if(unzip1)unzip1.setStyles('visibility:hidden');
			if(unzip2)unzip2.setStyles('visibility:hidden');
			if(file)file.value='';
			if(url)url.value='';
			$('kfm_uploadForm').setStyles('display:'+(copy?'none':'block'));
			$('kfm_copyForm').setStyles('display:'+(copy?'block':'none'));
		});
		{ // upload from computer
			{ // normal single-file upload form
				var f1=newForm('upload.php','POST','multipart/form-data','kfm_iframe');
				f1.id='kfm_uploadForm';
				var iframe=new Element('iframe',{
					'id':'kfm_iframe'
				});
				iframe.src='javascript:false';
				iframe.setStyles('display:none');
				var submit=newInput('upload','submit',kfm_lang.Upload);
				submit.addEvent('click',function(){
					setTimeout('$("kfm_file").type="text";$("kfm_file").type="file"',1);
				});
				var input=newInput('kfm_file','file');
				input.addEvent('keyup',kfm_uploadPanel_checkForZip);
				input.addEvent('change',kfm_uploadPanel_checkForZip);
				var unzip1=new Element('span',{
					'id':'kfm_unzip1',
					'class':'kfm_unzipWhenUploaded',
					'styles':{
						'visibility':'none'
					}
				});
				kfm_addEl(unzip1,[newInput('kfm_unzipWhenUploaded','checkbox'),kfm_lang.ExtractAfterUpload]);
				kfm_addEl(f1,[input,submit,unzip1]);
			}
			{ // load multi-upload thing if possible
				window.swfu=new SWFUpload({
					upload_script:"../upload.php?session_id="+window.session_id,
					target:"kfm_iframe",
					flash_path:"swfupload/SWFUpload.swf",
					allowed_filesize:99999999,	// large limit
					allowed_filetypes:"*.*",
					allowed_filetypes_description:kfm_lang.AllFiles,
					upload_file_complete_callback:"swfu.upload_file_complete",
					upload_file_queued_callback:"swfu.upload_file_queued",
					upload_queue_complete_callback:'swfu.upload_queue_complete',
					flash_loaded_callback:'swfu.flashLoaded',
					create_ui:true
				});
				window.swfu.loadUI=function(){
					var t=new Element('table'),r,c,inp1,inp2,instance=this;
					t.style.width='100%';
					r=kfm_addRow(t);
					{ // browse button
						c=kfm_addCell(r);
						c.style.width='10%';
						inp1=newInput('kfm_multiChooseFile','button',kfm_lang.Browse);
						inp1.addEvent('click',function(){instance.browse()});
						kfm_addEl(c,inp1);
					}
					{ // file queue
						c=kfm_addCell(r,1);
						c.id='kfm_files_to_upload';
					}
					r=kfm_addRow(t);
					{ // upload button
						c=kfm_addCell(r);
						inp2=newInput('kfm_uploadButton','button',kfm_lang.Upload);
						inp2.addEvent('click',function(){instance.upload()});
						kfm_addEl(c,inp2);
					}
					{ // progress meter
						c=kfm_addCell(r,1);
						c.appendChild(new Element('div',{
							'id':'kfm_file_upload_progress_meter',
							'styles':{
								'display':'block',
								'background':'#00f',
								'width':0,
								'height':10
							}
						}));
					}
					kfm_addEl($('kfm_uploadForm').empty(),t);
					instance.set_number_of_files(0);
				}
				window.swfu.upload_file_complete=function(){
					window.swfu.number_uploaded++;
					var meter=$('kfm_file_upload_progress_meter');
					meter.setStyle('width',meter.parentNode.offsetWidth*(window.swfu.number_uploaded/window.swfu.number_of_files));
				}
				window.swfu.upload_file_queued=function(file,qlen){
					window.swfu.set_number_of_files(qlen);
				}
				window.swfu.upload_queue_complete=function(){
					x_kfm_loadFiles(kfm_cwd_id,kfm_refreshFiles);
					window.swfu.set_number_of_files(0);
					$("kfm_file_upload_progress_meter").setStyle('width',0);
				}
				window.swfu.set_number_of_files=function(n){
					kfm_addEl($('kfm_files_to_upload').empty(),'Files to upload: '+n);
					window.swfu.number_of_files=n;
					window.swfu.number_uploaded=0;
				}
			}
		}
		{ // copy from URL
			var f2=new Element('div',{
				'id':'kfm_copyForm',
				'styles':{
					'display':'none'
				}
			});
			var submit2=newInput('upload','submit',kfm_lang.CopyFromURL);
			var inp2=newInput('kfm_url',0,0,0,0,'width:100%');
			inp2.onkeyup=kfm_uploadPanel_checkForZip;
			inp2.onchange=kfm_uploadPanel_checkForZip;
			submit2.onclick=kfm_downloadFileFromUrl;
			var unzip2=new Element('span',{
				'id':'kfm_unzip2',
				'class':'kfm_unzipWhenUploaded',
				'styles':{
					'visibility':'hidden'
				}
			});
			kfm_addEl(unzip2,[newInput('kfm_unzipWhenUploaded','checkbox'),kfm_lang.ExtractAfterUpload]);
			kfm_addEl(f2,[inp2,submit2,unzip2]);
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
	var el=$extend(
		kfm_addEl(
			new Element('div',{
				'id':id,
				'class':'kfm_panel'
			}),
			[
				(new Element('div',{
					'class':'kfm_panel_header'
				})).setHTML(title),
				kfm_addEl(new Element('div',{
					'class':'kfm_panel_body'
				}),subels)
			]
		),
		{
			state:0,height:0,panel_title:title,abilities:0,visible:1,order:99,
			addCloseButton:function(){if(this.abilities&1)this.addButton('removePanel','','x',kfm_lang.Close)},
			addMaxButton:function(){this.addButton('maximisePanel','','M',kfm_lang.Maximise)},
			addMinButton:function(){this.addButton('minimisePanel','','_',kfm_lang.Minimise)},
			addMoveDownButton:function(){if(this.id!=this.parentNode.panels[this.parentNode.panels.length-1])this.addButton('movePanel',',1','d',kfm_lang.MoveDown)},
			addMoveUpButton:function(){if(this.id!=this.parentNode.panels[0])this.addButton('movePanel',',-1','u',kfm_lang.MoveUp)},
			addRestoreButton:function(){this.addButton('restorePanel','','r',kfm_lang.Restore)},
			addButton:function(f,p,b,t){
				if(this.abilities==-1)return;
				kfm_addEl(this.childNodes[0],newLink('javascript:kfm_'+f+'("'+this.parentNode.id+'","'+this.id+'"'+p+')','['+b+']',0,'kfm_panel_header_'+b,t));
			}
		}
	);
	if(vars)el=$extend(el,vars);
	return el;
}
function kfm_createPanelWrapper(name){
	return $extend(new Element('div',{
		'id':name,
		'class':'kfm_panel_wrapper'
	}),{panels:[]});
}
function kfm_createSearchPanel(){
	var t=new Element('table',{
		'id':'kfm_search_table'
	}),r,inp,rows=0;
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
	for(var i=0;i<wrapper.panels.length;++i)if(wrapper.panels[i]==panel)return true;
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
	for(i=0;i<ps.length;++i){
		var el=$(ps[i]);
		if(kfm_inArray(el.id,kfm_hidden_panels))el.visible=false;
		if(el.id=='kfm_file_upload_panel')el.visible=kfm_directories[kfm_cwd_id].is_writable;
		if(el.visible){
			el.setStyles('display:block');
			el.minheight=el.childNodes[0].offsetHeight;
			minheight+=el.minheight;
			switch(el.state){
				case 0: minimised[minimised.length]=ps[i]; break;
				case 1: maximised[maximised.length]=ps[i]; break;
				case 2: fixed_height[fixed_height.length]=ps[i]; break;
				case 3: fixed_height_maxed[fixed_height_maxed.length]=ps[i]; break;
				default: kfm_log(kfm_lang.UnknownPanelState+el.state);
			}
		}
		else el.setStyles('display:none');
	}
	var height=wrapper.offsetHeight;
	for(i=0;i<minimised.length;++i){
		var n=minimised[i];
		var el=$(n);
		el.childNodes[1].setStyles('display:none');
		var head=el.childNodes[0].empty(),els=[];
		if(wrapper.panels_unlocked){
			el.addCloseButton();
			el.addMaxButton();
			el.addMoveDownButton();
			el.addMoveUpButton();
		}
		els[els.length]=el.panel_title;
		kfm_addEl(head,els);
	}
	for(i=0;i<fixed_height.length;++i){
		var n=fixed_height[i];
		var el=$(n);
		el.childNodes[1].setStyles('height:'+el.height+'px;display:block');
		minheight+=el.height;
		var head=el.childNodes[0].empty(),els=[];
		if(wrapper.panels_unlocked){
			el.addCloseButton();
			el.addMaxButton();
			el.addMinButton();
			el.addMoveDownButton();
			el.addMoveUpButton();
		}
		els[els.length]=el.panel_title;
		kfm_addEl(head,els);
	}
	for(i=0;i<fixed_height_maxed.length;++i){
		var n=fixed_height_maxed[i];
		var el=$(n),body=el.childNodes[1].setStyles('height:auto;display:block');
		minheight+=body.offsetHeight;
		var head=el.childNodes[0].empty(),els=[];
		if(wrapper.panels_unlocked){
			el.addCloseButton();
			el.addMinButton();
			el.addMoveDownButton();
			el.addMoveUpButton();
		}
		els[els.length]=el.panel_title;
		kfm_addEl(head,els);
	}
	if(maximised.length)var size=(height-minheight)/maximised.length;
	for(i=0;i<maximised.length;++i){
		var n=maximised[i];
		var el=$(n);
		el.childNodes[1].setStyles('height:'+size+'px;display:block');
		var head=el.childNodes[0].empty(),els=[];
		if(wrapper.panels_unlocked){
			el.addCloseButton();
			el.addRestoreButton();
			el.addMinButton();
			el.addMoveDownButton();
			el.addMoveUpButton();
		}
		els[els.length]=el.panel_title;
		kfm_addEl(head,els);
	}
	{ // fix order of panels
		do{
			var els=wrapper.childNodes,arr=[],found=0,prev=0;
			for(var i=0;i<els.length,!found,els[i];++i){
				var order=els[i].order;
				if(order<prev&&i){
					wrapper.insertBefore(els[i],els[i-1]);
					found=1;
				}
				prev=order;
			}
		}while(found);
		for(i=0;i<els.length;++i)arr.push(els[i].order);
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
	if(!p.height)p.height=p.childNodes[1].offsetHeight;
	kfm_refreshPanels(wrapper);
}
function kfm_togglePanelsUnlocked(){
	$('kfm_left_column').panels_unlocked=1-$('kfm_left_column').panels_unlocked;
	kfm_refreshPanels('kfm_left_column');
}
