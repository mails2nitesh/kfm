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
function kfm_createContextMenu(m,show_category_headers){
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
						if((m.x+list.width()+$j(this).width())>$j(document).width())$j(this).css('left',-$j(this).width());
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
		
		if(show_category_headers || issub)list.append(head);
		for(var i=0;i<cat.size();i++){
			if(cat.items[i].nocontextmeu) continue;
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
	//list.css({left:m.x,top:m.y});
	if((m.y+list.height())>$j(document).height())list.css('top',m.y-list.height());
	else list.css('top',m.y);
	if((m.x+list.width())>$j(document).width())list.css('left',m.x-list.width());
	else list.css('left',m.x);
	list.find('.subcontextmenu').css('left',list.width());
	list.show('normal');
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
