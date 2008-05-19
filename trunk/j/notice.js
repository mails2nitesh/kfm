var Notice=new Class({
	getWrapper:function(){
		var w=$('notice_wrapper');
		if(w)return w;
		w=new Element('div',{
			'id':'notice_wrapper',
			'styles':{
				'position':'absolute',
				'top':5,
				'right':5,
				'z-index':222
			}
		});
		document.body.appendChild(w);
		return w;
	},
	initialize:function(message){
		var id=_Notices++;
		this.id=id;
		var notice_message=new Element('div',{
			'id':'notice_message_'+id,
			'class':'notice'
		});
		$j(notice_message).css({opacity:0});
		notice_message.setHTML(message);
		this.getWrapper().appendChild(notice_message);
		$j(notice_message).animate({ opacity:1},1000,'linear',function(){
			$j(notice_message).animate({ opacity:0 },2000,'linear',function(){
				$j(notice_message).animate({ height:0 },3000,'linear',function(){
					$j(notice_message).remove();
				});
			});
		});
	}
});
var _Notices=0;
