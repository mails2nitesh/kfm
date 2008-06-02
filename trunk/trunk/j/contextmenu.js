// see license.txt for licensing
function kfm_closeContextMenu(){
	$j('.contextmenu').remove();
	return;
	if(contextmenu)contextmenu.remove();
	contextmenu=null;
}
function kfm_contextmenuinit(){
	document.addEvent('click',function(e){
		e=new Event(e);
		if(e.control)return;
		if(!contextmenu)return;
		var c=contextmenu,m=e.page;
		var l=c.offsetLeft,t=c.offsetTop;
		if(m.x<l||m.x>l+c.offsetWidth||m.y<t||m.y>t+c.offsetHeight)kfm_closeContextMenu();
	});
	kfm_addContextMenu(document,function(e){
		if(window.webkit||!e.control)e.stop();
	});
}
function kfm_createContextMenu(m,links){
	var li,category,cat,sublist,issub,contextlink;
	var list=$j('<ul></ul>').addClass('contextmenu');
	var firsthead=true;
	for(category in context_categories){
		cat=context_categories[category];
		if(typeof(cat)!='object' || cat.type!='context_category'){dump(cat);continue;}
		if(cat.size()==0)continue;
		var head=$j('<li><span>'+cat.title+'</span></li>');
		if(cat.size()>subcontext_size || kfm_inArray(cat.name, subcontext_categories)){
			issub=true;
			firsthead=true; // a head after a submenu is also a first one
			sublist=$j('<ul></ul>').addClass('subcontextmenu');
			head.append(sublist);
			head.addClass('contextmenu_subhead');
			head.hover(
				function(){
					$j(this).children('ul').each(function(i){
						var top=$j(this).siblings('span').position().top;
						$j(this).css('top',top).show();
					});
					$j(this).addClass('contextmenu_subhead_hover');
				},
				function(){
					$j(this).children('ul').hide();
					$j(this).removeClass('contextmenu_subhead_hover');
				}
			);
		}else{
			if(firsthead){
				head.addClass('contextmenu_head_first');
				firsthead=false;
			}
			issub=false;
			head.addClass('contextmenu_head');
			head.hover(function(){$j(this).addClass('contextmenu_head_hover');},function(){$j(this).removeClass('contextmenu_head_hover')});
		}
		head.addClass('contextmenu_head_'+cat.name);
		
		list.append(head);
		for(var i=0;i<cat.size();i++){
			contextlink=$j('<span>'+cat.items[i].title+'</span>');
			//$j(contextlink).attr('doFunction',cat.items[i].doFunction);
			//contextlink.attr('doParameter',cat.items[i].doParameter);
			li=$j('<li></li>').addClass('kfm_plugin_'+cat.items[i].name+'_contexticon').
			addClass('kfm_plugin_'+cat.items[i].name+'_'+kfm_theme+'_contexticon');
			li.append(contextlink);
			li.hover(function(){$j(this).addClass('hover');},function(){$j(this).removeClass('hover');});
			li.click(function(){kfm_closeContextMenu();this.doFunction(this.doParameter);});
			li.each(function(){
				this.doFunction=cat.items[i].doFunction;
				this.doParameter=cat.items[i].doParameter;
			});
			if(issub){
				li.addClass('subcontextmenu_link');
				sublist.append(li);
			}else{
				li.addClass('contextmenu_link');
				list.append(li);
			}
		}
		cat.clear();
	}
	$j('body').append(list);
	list.css({left:m.x,top:m.y});
	list.find('.subcontextmenu').css('left',list.width());
	list.show('normal');
	return;
	var row;
	if(!window.contextmenu_loading)kfm_closeContextMenu();
	if(!contextmenu){
		window.contextmenu=new Element('table',{
			'class':'contextmenu',
			'styles':{
				'left':m.x,
				'top':m.y
			}
		});
		window.contextmenu.addLink=function(href,text,icon,disabled,isSubMenu, obj){
			if(disabled && !kfm_vars.show_disabled_contextmenu_links)return;
			row=kfm.addRow(this);
			if(disabled){
				row.className+=' disabled';
				href='';
			}
			if(isSubMenu){
				link=newLink('javascript:kfm_cm_openSubMenu("'+href+'",this);',text);
				row.className+=' is_submenu';
			}
			else if(href=='kfm_0')link=text;
			else{
				if(typeof(href)=="object"){
					var display=1; // default, display
					if(href.displayCheck) display=href.displayCheck(href.doParameter);
					if(!display)return;
					if(display==2)row.className+=' disabled';
					if(!href.name && href.title)href.name=href.title; // make name title if not exists
					if(!href.name) href.name='default'; // make name default if not exists
					link=newLink('#',href.title);
					link.doFunction=href.doFunction;
					link.doParameter=href.doParameter;
					link.addEvent("click",function(){
						kfm_closeContextMenu();
						href.doFunction(href.doParameter);
					});
				}
				else link=newLink('javascript:kfm_closeContextMenu();'+href,text);
			}
			if(typeof(href)=="object") kfm.addCell(row,0,0,'','kfm_contextmenu_iconCell kfm_plugin_'+href.name+'_contexticon kfm_plugin_'+href.name+'_'+kfm_theme+'_contexticon');
			else kfm.addCell(row,0,0,(icon?new Element('img',{src:'themes/'+kfm_theme+'/icons/'+icon+'.png'}):''),'kfm_contextmenu_iconCell');
			kfm.addCell(row,1,0,link,'kfm_contextmenu_nameCell');
			try{
				row.className+=' cm_'+href.name.replace(/[^a-zA-Z]*/g,'');
			}catch(e){
				row.className+=' cm_'+link.innerHTML.replace(/[^a-zA-Z]*/g,'');
			}
		};
		window.contextmenu_loading=setTimeout('window.contextmenu_loading=null',1);
		document.body.appendChild(contextmenu);
	}
	else{
		row=kfm.addRow(contextmenu);
		row.className+=' cm__separator';
		var col=kfm.addCell(row,0,2);
		col.appendChild(new Element('hr'));
	}
	var rows=contextmenu.rows.length;
	for(var i=0;i<links.length;++i){
		var link=links[i];
		if($type(link)=="object")contextmenu.addLink(link);
		else if(link[1])contextmenu.addLink(link[0],link[1],link[2],link[3],link[4]);
	}
	var w=contextmenu.offsetWidth,h=contextmenu.offsetHeight,ws=window.getSize().size;
	if(h+m.y>ws.y)contextmenu.style.top=(ws.y-h)+'px';
	if(w+m.x>ws.x)contextmenu.style.left=(m.x-w)+'px';
}
function kfm_addContextMenu(el,fn){
	el.addEvent(window.webkit&&!window.webkit420?'mousedown':'contextmenu',function(e){
		e=new Event(e);
		if(e.type=='contextmenu' || e.rightClick)fn(e);
	});
	return el;
}
kfm.cm={
	submenus:[]
}
