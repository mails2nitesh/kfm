// see license.txt for licensing
kfm_dir_bits={
	contextMenu:function(e){
		var el=e.target;
		while(el&&!el.node_id)el=el.parentNode;
		if(!el)return;
		var links=[],i,node_id=el.node_id;
		if(kfm_vars.permissions.dir.ed)context_categories['edit'].add({
			name:'directory_rename',
			title:kfm.lang.RenameDir,
			category:'edit',
			doFunction:function(){kfm_renameDirectory(node_id)}
		});
		if(kfm_vars.permissions.dir.mk)context_categories['main'].add({
			name:'directory_new',
			title:kfm.lang.CreateSubDir,
			category:'main',
			doFunction:function(){kfm_createDirectory(node_id)}
		});
		if(node_id!=1 && kfm_vars.permissions.dir.rm)context_categories['edit'].add({
			name:'directory_delete',
			title:kfm.lang.DeleteDir,
			category:'edit',
			doFunction:function(){kfm_deleteDirectory(node_id)}
		});
		if(kfm_return_directory)context_categories['returning'].add({
			name:'directory_return',
			title:kfm.lang.SendToCms,
			doFunction:function(){
				setTimeout("window.close()",1);
				window.opener.SetUrl(kfm_directories[node_id].realpath+'/');
			}
		});
		if(kfm_directories[node_id].writable){
			for(i=0;i<HooksDirectoryWritable.length;i++){
				obj=HooksDirectoryWritable[i];
				context_categories[obj.category].add(obj);
			}
		}else{
			for(i=0;i<HooksDirectoryReadonly.length;i++){
				obj=HooksDirectoryReadonly[i];
				context_categories[obj.category].add(obj);
			}
		}
		//e=new Event(e);
		//kfm_createContextMenu(e.page,links);
	},
	clickDir:function(e){
		e=new Event(e);
		if(e.rightClick)return;
		kfm_changeDirectory(this.id);
	},
	removeHover:function(){
		kfm_directory_over=0;
		$j(this).removeClass('hovered');
	},
	addHover:function(){
		if(!this.actionEvents){
			$j.event.add(this,'click',window.kfm_dir_bits.clickDir);
			$j.event.add(this,'mouseout',window.kfm_dir_bits.removeHover);
			this.actionEvents=true;
		}
		if(kfm_directory_over==this.node_id)return;
		this.className+=' hovered';
		kfm_directory_over=+this.node_id;
	}
};
function kfm_changeDirectory(id, nofiles){
	if(!isNaN(id))id='kfm_directory_icon_'+id;
	if(id=='kfm_directory_icon_0')id='kfm_directory_icon_1';
	var el=document.getElementById(id);
	if(!el)return;
	var a,els=$j('td.kfm_directory_open');
	setTimeout('clearTimeout(window.dragTrigger);',1);
	if(window.ie)while(el&&!el.node_id)el=el.parentNode;
	kfm_cwd_name=el.kfm_directoryname;
	kfm_cwd_id=el.node_id;
	clearTimeout(window.kfm_incrementalFileDisplay_loader);
	for(var a=0;a<els.length;++a)$j(els[a]).removeClass('kfm_directory_open');
	el.parentNode.className+=' kfm_directory_open';
		kfm_filesLoader();
	if(!nofiles){
		setTimeout('x_kfm_loadFiles(kfm_cwd_id,kfm_refreshFiles);',20);
	}
	setTimeout('x_kfm_loadDirectories(kfm_cwd_id,kfm_refreshDirectories);',20);
}
function kfm_createDirectory(id){
	if(!kfm_vars.permissions.dir.mk)return kfm.alert('permission denied: cannot create directory');
	kfm_prompt(kfm.lang.CreateDirMessage(kfm_directories[id].path),kfm.lang.NewDirectory,function(newName){
		if(newName&&newName!=''&&!/\/|^\./.test(newName))x_kfm_createDirectory(id,newName,kfm_refreshDirectories);
	});
}
function kfm_deleteDirectory(id){
	if(!kfm_vars.permissions.dir.rm)return kfm.alert('permission denied: cannot delete directory');
	if(!kfm.confirm(kfm.lang.DelDirMessage(kfm_directories[id].path)))return;
	if(kfm_directories[id].hasChildren && !kfm.confirm(kfm.lang.RecursiveDeleteWarning(kfm_directories[id].name)))return;
	x_kfm_deleteDirectory(id,kfm_deleteDirectoryCheck);
}
function kfm_deleteDirectoryCheck(res){
	if(res.type&&res.type=='error'){
		switch(parseInt(res.msg)){
			case 1: kfm_log('error: '+kfm.lang.IllegalDirectoryName(res.name)); break;
			case 2:{ // not empty
				var ok=kfm.confirm(kfm.lang.RecursiveDeleteWarning(res.name));
				if(ok)x_kfm_deleteDirectory(res.id,1,kfm_deleteDirectoryCheck);
				break;
			}
			case 3: kfm_log('error: '+kfm.lang.RmdirFailed(res.name)); break;
			case 4: kfm_log('error: '+kfm.lang.DirectoryNotInDb); break;
			default: new Notice(res.msg);
		}
	}
	else{
		var is_found=0,p=res.oldpid;
		while(p&&!is_found){
			if(p==kfm_cwd_id)is_found=1;
			p=kfm_directories[p].parent;
		}
		if(is_found)kfm_changeDirectory('kfm_directory_icon_'+p);
		kfm_refreshDirectories(res);
	}
}
function kfm_dir_addLink(t,name,parent_addr,is_last,has_node_control,parent){
	var r=kfm.addRow(t);
	var c,pdir=parent_addr+name,name=(name==''?kfm_vars.root_folder_name:name),name_text,el,openerEl;
	// {{{ directory element
	el=document.createElement('div');
	el.id='kfm_directory_icon_'+parent;
	el.className='kfm_directory_link '+(kfm_cwd_name==pdir?'':'kfm_directory_open');
	// {{{ name
	name_text=document.createElement('span');
	name_text.id='directory_name_'+parent;
	name_text.innerHTML='0';
	// }}}
	el.appendChild(name_text);
	el.kfm_directoryname=pdir;
	el.node_id=parent;
	el.style.cursor=window.ie?'hand':'pointer';
	kfm_addContextMenu(el,window.kfm_dir_bits.contextMenu);
	// }}}
	// {{{ create table elements
	if(has_node_control){
		openerEl=newLink('javascript:kfm_dir_openNode('+parent+')','[+]','kfm_dir_node_'+parent,'kfm_dir_node_closed');
	}
	else{
		openerEl=document.createElement('span');
		openerEl.id='kfm_dir_node_'+parent;
		openerEl.innerHTML='&nbsp;';
	}
	var cell=kfm.addCell(r,0,0,openerEl,'kfm_dir_lines_'+(is_last?'lastchild':'child'));
	cell.style.width='16px';
	cell=kfm.addCell(r,1,0,el,'kfm_dir_name');
	if(window.webkit){ // fix cell width for konqueror
		cell.style.width=(t.offsetWidth-16)+'px';
	}
	// }}}
	$j.event.add(el,'mouseover',window.kfm_dir_bits.addHover);
	{ // fix name width
		var reqHeight=name_text.offsetHeight;
		name_text.innerHTML='. '+name;
		el=name_text;
		el.style.display='block';
		if(reqHeight&&el.offsetHeight>reqHeight){
			el.title=name;
			kfm_shrinkName(name,el,el,'offsetHeight',reqHeight,'');
		}
		else el.innerHTML=name;
		if(!window.ie)el.style.position='inherit';
	}
	{ // subdir holder
		r=kfm.addRow(t);
		kfm.addCell(r,0,0,' ',is_last?0:'kfm_dir_lines_nochild');
		kfm.addCell(r,1).id='kfm_directories_subdirs_'+parent;
	}
	kdnd_makeDraggable('kfm_dir_name');
	kdnd_addDropHandler('kfm_dir_name','.kfm_dir_name',kfm_dir_dropHandler);
	return t;
}
function kfm_dir_dropHandler(e){
	var dir_from=parseInt($j('.kfm_directory_link',e.sourceElement).attr('node_id'));
	if(dir_from==1)return;
	var dir_to=parseInt($j('.kfm_directory_link',e.targetElement).attr('node_id'));
	if(dir_to==0||dir_to==dir_from)return;
	if(!kfm_vars.permissions.dir.mv)return kfm.alert(kfm.lang.CannotMoveDirectory);
	x_kfm_moveDirectory(dir_from,dir_to,kfm_refreshDirectories);
	kfm_selectNone();
}
function kfm_dir_openNode(dir){
	var node=document.getElementById('kfm_dir_node_'+dir);
	node.className='kfm_dir_node_opened';
	if(node.href)node.href=node.href.replace(/open/,'close');
	document.getElementById('kfm_directories_subdirs_'+dir).innerHTML=kfm.lang.Loading;
	x_kfm_loadDirectories(dir,kfm_refreshDirectories);
}
function kfm_dir_closeNode(dir){
	var node=document.getElementById('kfm_dir_node_'+dir);
	node.className='kfm_dir_node_closed';
	if(node.href)node.href=node.href.replace(/close/,'open');
	document.getElementById('kfm_directories_subdirs_'+dir).innerHTML='';
}
function kfm_refreshDirectories(res){
	var d,p,t;
	if(res.toString()===res)return kfm_log(res);
	d=res.parent;
	if(d==kfm_vars.root_folder_id){ // root node
		p=document.getElementById('kfm_directories');
		t=document.createElement('table');
		t.id='kfm_directories';
		p.parentNode.replaceChild(kfm_dir_addLink(t,'','',1,0,kfm_vars.root_folder_id),p);
		kfm_directories[kfm_vars.root_folder_id]={
			'parent':0,
			'name':kfm_vars.root_folder_name,
			'path':'/',
			'realpath':res.properties.path,
			'hasChildren':res.directories.length,
			'writable':res.properties.writable
		}
		document.getElementById('kfm_directory_icon_'+kfm_vars.root_folder_id).parentNode.className+=' kfm_directory_open';
	}
	t=document.createElement('table'),n='kfm_dir_node_'+d;
	t.style.tableLayout='fixed';
	dirwrapper=document.getElementById('kfm_directories_subdirs_'+d);
	dirwrapper.innerHTML='';
	dirwrapper.appendChild(t);
	var dirs=$A(res.directories);
	dirs.each(function(dir,a){
		kfm_dir_addLink(t,dir[0],res.reqdir,l=(a==dirs.length-1),dir[1],dir[2]);
		if(!kfm_directories[dir[2]])kfm_directories[dir[2]]={
			'parent':res.parent,
			'name':dir[0],
			'path':res.reqdir+dir[0],
			'realpath':res.properties.path+dir[0]+'/',
			'hasChildren':dir[1],
			'writable':res.properties.writable
		};
	});
	if(d!=''){
		p2=document.getElementById(n).parentNode;
		p2.innerHTML='';
		var openerEl;
		if(dirs.length){
			openerEl=newLink('javascript:kfm_dir_closeNode("'+res.parent+'")','[-]',n,'kfm_dir_node_open');
		}
		else{
			openerEl=document.createElement('span');
			openerEl.id=n;
			openerEl.innerHTML=' ';
		}
		p2.appendChild(openerEl);
	}
	kfm_cwd_subdirs[d]=res.directories;
	if(!kfm_cwd_subdirs[d])kfm_dir_openNode(res.parent);
	kfm_setDirectoryProperties(res.properties);
	if(!kfm_vars.startup_sequence)kfm_selectNone();
	kfm_log(kfm.lang.DirRefreshed);
	kfm_directories[kfm_cwd_id]=res.properties;
	kfm_directories[d].hasChildren=1;
	if(kfm_startup_sequence_index<kfm_vars.startup_sequence.length){
		kfm_changeDirectory(kfm_vars.startup_sequence[kfm_startup_sequence_index],true);
		kfm_startup_sequence_index++;
		if(kfm_startup_sequence_index > kfm_vars.startup_sequence.length)kfm_vars.startup_sequence=false;
	}
	else kfm_refreshPanels('kfm_left_column');
}
function kfm_renameDirectory(id){
	var directoryName=kfm_directories[id].name;
	kfm_prompt(kfm.lang.RenameTheDirectoryToWhat(directoryName),directoryName,function(newName){
		if(!newName||newName==directoryName)return;
		kfm_directories[id]=null;
		kfm_log(kfm.lang.RenamedDirectoryAs(directoryName,newName));
		x_kfm_renameDirectory(id,newName,kfm_refreshDirectories);
	});
}
function kfm_setDirectoryProperties(properties){
	var wrapper=document.getElementById('kfm_directory_properties');
	if(!wrapper)return;
	wrapper.innerHTML='';
	wrapper.properties=properties;
	var table=document.createElement('table'),row,cell,i;
	{ // directory name
		i=properties.allowed_file_extensions.length?properties.allowed_file_extensions.join(', '):kfm.lang.NoRestrictions;
		row=kfm.addRow(table);
		var nameEl=document.createElement('strong');
		nameEl.innerHTML=kfm.lang.Name;
		kfm.addCell(row,0,0,nameEl);
		kfm.addCell(row,1,0,'/'+kfm_cwd_name);
	}
	{ // allowed file extensions
		i=properties.allowed_file_extensions.length?properties.allowed_file_extensions.join(', '):kfm.lang.NoRestrictions;
		row=kfm.addRow(table);
		var extensionsEl=document.createElement('strong');
		extensionsEl.innerHTML=kfm.lang.AllowedFileExtensions;
		kfm.addCell(row,0,0,extensionsEl);
		kfm.addCell(row,1,0,i);
	}
	wrapper.appendChild(table);
}
