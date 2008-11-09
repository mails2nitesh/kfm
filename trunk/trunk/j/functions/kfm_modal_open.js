window.kfm_modal_open=function(form,title,actions){
	window.inPrompt=1;
	var body=document.body,scrollAt=window.ie?getWindowScrollAt():{x:0,y:0},wx=0,wy=0,pos=window.ie?'absolute':'fixed',i,a,win;
	win=$j(window);
	a={x:win.width(),y:win.height()};
	if(window.ie)body.style.overflow='hidden';
	{ // shader
		var shader=document.createElement('div');
		shader.id='shader';
		shader.style.background='#fff';
		$j(shader).css("opacity",0.5);
		shader.style.position=pos;
		shader.style.top=scrollAt.y+'px';
		shader.style.left=scrollAt.x+'px';
		shader.style.zIndex=2;
		shader.style.width=a.x+'px';
		shader.style.height=a.y+'px';
		body.appendChild(shader);
	}
	{ // wrapper
		var wrapper=document.createElement('div');
		wrapper.id='formWrapper';
		wrapper.className='modal_dialog drag_this';
		var h2=document.createElement('h2');
		h2.innerHTML=title;
		h2.className='prompt';
		form.style.position ='relative';
		form.style.margin   =0;
		form.style.textAlign='left';
		form.style.padding  =0;
		form.style.clear    ='left';
		wrapper.appendChild(h2);
		wrapper.appendChild(form);
		{ // link row
			var row=document.createElement('div');
			var link=document.createElement('a');
			link.href='javascript:kfm_modal_close()';
			link.innerHTML=kfm.lang.Cancel;
			link.className='button';
			row.appendChild(link);
			if(actions&&actions.length)for(i=0;i<actions.length;++i){
				var v=actions[i];
				link=document.createElement('a');
				link.href='#';
				link.innerHTML=v[0];
				$j.event.add(link,'click',v[1]);
				link.className='button';
				row.appendChild(link);
			}
			wrapper.appendChild(row);
