window.kdnd_dragStart=function(el,source_class){
	window.kdnd_dragging=true;
	window.kdnd_drag_class=source_class;
	window.kdnd_source_el=el;
	var content=el.dragDisplay?el.dragDisplay():el.cloneNode(true);
	if($j(el).css('position')=='absolute' || $j(el).css('position')=='fixed'){
		content.style.position='static';
		content.style.left    =0;
		content.style.top     =0;
	}
	if(!$j(el).hasClass('drag_this'))window.kdnd_offset={'x':16,'y':0};
	window.kdnd_drag_wrapper=document.createElement('div');
	window.kdnd_drag_wrapper.id='kdnd_drag_wrapper';
	window.kdnd_drag_wrapper.style.display='none';
	window.kdnd_drag_wrapper.style.opacity=.7;
	window.kdnd_drag_wrapper.appendChild(content);
	document.body.appendChild(window.kdnd_drag_wrapper);
	$j.event.add(document,'mousemove',kdnd_drag);
}
