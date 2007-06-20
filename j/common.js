// see ../license.txt for licensing
function clearSelections(){
	window.getSelection().removeAllRanges();
}
function getEls(i,p){
	return p?p.getElementsByTagName(i):document.getElementsByTagName(i);
}
function getEvent(e){
	return e?e:(window.event?window.event:"");
}
function getEventTarget(e,tagName){
	return getEvent(e).currentTarget;
}
function getMouseAt(e){
	e=getEvent(e);
	var m=getWindowScrollAt();
	m.x+=e.clientX;
	m.y+=e.clientY;
	return m;
}
function getOffset(el,s) {
	if(!el)return 0;
	var n=parseInt(el['offset'+s]),p=el.offsetParent;
	if(p)n+=getOffset(p,s)-parseInt(p['scroll'+s]);
	return n;
}
function getWindowScrollAt(){
	return {x:window.pageXOffset,y:window.pageYOffset};
}
function kfm_kaejax_do_call(func_name,args){
	var uri=function_urls[func_name];
	if(!window.kfm_kaejax_timeouts[uri])window.kfm_kaejax_timeouts[uri]={t:setTimeout('kfm_kaejax_sendRequests("'+uri+'")',1),c:[],callbacks:[]};
	var l=window.kfm_kaejax_timeouts[uri].c.length,v2=[];
	for(var i=0;i<args.length-1;++i)v2[v2.length]=args[i];
	window.kfm_kaejax_timeouts[uri].c[l]={f:func_name,v:v2};
	window.kfm_kaejax_timeouts[uri].callbacks[l]=args[args.length-1];
}
function kfm_kaejax_sendRequests(uri){
	var t=window.kfm_kaejax_timeouts[uri],callbacks=window.kfm_kaejax_timeouts[uri].callbacks;
	t.callbacks=null;
	window.kfm_kaejax_timeouts[uri]=null;
	var x=new XMLHttpRequest(),post_data="kaejax="+escape(Json.toString(t)).replace(kfm_regexps.plus,'%2B').replace(kfm_regexps.ascii_stuff,'%u00$1').replace(/\n/g,' ');
	post_data=kfm_sanitise_ajax(post_data);
	x.open('POST',uri,true);
	x.setRequestHeader("Method","POST "+uri+" HTTP/1.1");
	x.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	x.onreadystatechange=function(){
		if(x.readyState!=4)return;
		var r=x.responseText;
		if(r.substring(0,5)=='error')return alert(r);
		var v=eval('('+unescape(r)+')');
		for(var i=0;i<t.c.length;++i){
			var f=callbacks[i],p=[];
			if($type(f)=='array'){
				p=f;
				f=f[0];
			}
			f(v[i],p);
		}
	}
	x.send(post_data);
}
function loadJS(url,id,lang,onload){
	var i=0;
	for(;i<loadedScripts.length;++i)if(loadedScripts[i]==url)return 0;
	loadedScripts.push(url);
	var el=newEl('script');
	el.type="text/javascript";
	if(id)el.id=id;
	if(lang)el.lang=lang;
	if(kfm_kaejax_is_loaded&&/\.php/.test(url))url+=(/\?/.test(url)?'&':'?')+'kfm_kaejax_is_loaded';
	if(onload){
		el.onload_triggered=0;
		el.onload=function(){
			if(!this.onload_triggered++)eval(onload);
		};
		el.onreadystatechange=function(){
			if(this.readyState=='loaded'||this.readyState=='complete')if(!this.onload_triggered++)eval(onload);
		};
	}
	el.src=url;
	getEls('head')[0].appendChild(el);
	return 1;
}
function newEl(t,id,cn,chld,vals,css){
	var el=document.createElement(t);
	if(t=='iframe')el.src='/i/blank.gif';
	if(id){
		el.id=id;
		el.name=id;
	}
	el=kfm_addMethods(el);
	if(chld)el.addEl(chld);
	if(cn)el.className=cn;
	if(vals)$extend(el,vals);
	if(css)el.setStyles(css);
	return el;
}
function newForm(action,method,enctype,target){
	return newEl('form',0,0,0,{action:action,method:method,enctype:enctype,target:target});
}
function newInput(n,t,v,cl){
	var b;
	if(!t)t='text';
	switch(t){
		case 'checkbox':{
			b=newEl('input',n,0,0,{type:'checkbox'},'width:auto');
			break;
		}
		case 'textarea':{
			b=newEl('textarea',n);
			break;
		}
		default:{
			b=newEl('input',n);
			b.type=t;
		}
	}
	if(v){
		if(t=='checkbox')$extend(b,{checked:'checked',defaultChecked:'checked'});
		else if(t!='datetime')b.value=v;
	}
	b.className=cl;
	return b;
}
function newLink(h,t,id,c,title){
	if(!title)title='';
	return newEl('a',id,c,t,{href:h,title:title});
}
function newSelectbox(name,keys,vals,s,f){
	var el2=newEl('select',name),el3,s2=0,i=0;
	if(!s)s=0;
	if(!vals)vals=keys;
	for(;i<vals.length;++i){
		var v1=vals[i].toString();
		var v2=v1.length>20?v1.substr(0,27)+'...':v1;
		el3=newEl('option',0,0,v2,{value:keys[i],title:v1});
		if(keys[i]==s)s2=i;
		el2.addEl(el3);
	}
	el2.selectedIndex=s2;
	if(f)el2.onchange=f;
	return el2;
}
function newText(a){
	return document.createTextNode(a);
}
function removeEvent(o,t,f){
	if(o&&o.removeEventListener)o.removeEventListener(t,f,false);
}
if(browser.isIE){
	function XMLHttpRequest(){
		var l=(ScriptEngineMajorVersion()>=5)?"Msxml2":"Microsoft";
		return new ActiveXObject(l+".XMLHTTP")
	}
	loadJS('j/browser-specific.ie.js');
}
if(browser.isKonqueror){
	loadJS('j/browser-specific.konqueror.js');
}
