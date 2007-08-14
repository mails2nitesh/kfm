function kfm_modal_close(msg){
	$('shader').remove();
	$('formWrapper').remove();
	if(msg)alert(msg);
}
function kfm_modal_open(form,title,actions){
	window.inPrompt=1;
	var body=document.body,shader=new Element('div',{
		'id':'shader'
	}),scrollAt=browser.isIE?getWindowScrollAt():{x:0,y:0},a=getWindowSize(),wx=0,wy=0,pos=browser.isIE?'absolute':'fixed',i;
	if(browser.isIE)body.setStyles({
		'overflow':'hidden'
	});
	{ // shader
		shader.setStyles({
			'background':'#fff',
			'opacity':'.5',
			'position':pos,
			'top':scrollAt.y,
			'left':scrollAt.x,
			'z-index':2,
			'width':a.x,
			'height':a.y
		});
		kfm.addEl(body,shader);
	}
	{ // wrapper
		var wrapper=new Element('div',{
			'id':'formWrapper'
		});
		var h2=(new Element('h2',{
			'styles':{
				'float':'left'
			}
		})).setHTML(title);
		form.setStyles({
			'position':'relative',
			'margin':0,
			'text-align':'left',
			'padding':0,
			'clear':'left'
		});
		kfm.addEl(wrapper,[h2,form]);
		{ // link row
			var row=new Element('div'),buttonStyle={
				'float':'right',
				'border':'1px solid',
				'border-color':'#ccc #666 #666 #ccc',
				'display':'block',
				'background':'#ddd',
				'color':'#000',
				'text-decoration':'none',
				'margin':2,
				'padding':0
			};
			var link=newLink('javascript:kfm_modal_close()','Close',0,'button');
			link.setStyles(buttonStyle);
			kfm.addEl(row,link);
			if(actions&&actions.length)for(i=0;i<actions.length;++i){
				var v=actions[i];
				if(v[1].toString()===v[1])link=newLink('javascript:'+v[1]+'()',v[0],0,'button');
				else{
					link=newLink('#',v[0],0,'button');
					link.addEvent('click',v[1]);
				}
				link.setStyles(buttonStyle);
				kfm.addEl(row,link);
			}
			kfm.addEl(wrapper,row);
		}
		row.setStyles({
			'background':'#eee',
			'border-top':'1px solid #ddd',
			'text-align':'right',
			'padding':'2px',
			'z-index':'3'
		});
		kfm.addEl(body,wrapper);
		wrapper.style.width=(form.offsetWidth+10)+'px';
		var w=wrapper.offsetWidth;
		if(w<200||w>a.x*.9){
			w=w<200?200:parseInt(a.x*.9);
			wrapper.setStyles({
				'width':w
			});
		}
		var h=browser.isIE?wrapper.offsetHeight:h2.offsetHeight+form.offsetHeight+row.offsetHeight,q=browser.isIE?1:0,r=browser.isIE?0:4;
		if(parseFloat(h)>parseFloat(a.y*.9)){
			h=parseInt(a.y*.9);
			var h3=h-row.offsetHeight-h2.offsetHeight-q;
			form.setStyles({
				'margin':'0 auto',
				'overflow':'auto',
				'height':h3,
				'max-height':h3
			});
		}else{
			var h3=h-row.offsetHeight-h2.offsetHeight-q;
			form.setStyles({
				'overflow':'auto',
				'width':'100%',
				'max-height':h3
			});
		}
		wrapper.setStyles({
			'position':pos,
			'left':scrollAt.x+a.x/2-w/2,
			'top':scrollAt.y+a.y/2-h/2,
			'background':'#fff',
			'z-index':3,
			'border':'1px solid #000'
		});
	}
}
