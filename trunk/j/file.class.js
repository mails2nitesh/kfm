var File=new Class({
	getText:function(varname){
		var el=new Element('span',{
			'class':varname+' file_'+varname+'_'+this.id
		});
		el.appendText($pick(this[varname],''));
		return el;
	},
	initialize:function(id){
		this.id=id;
		x_kfm_getFileDetails(id,function(el){
			var id=parseInt(el.id);
			el=$H(el);
			var F=File_getInstance(id);
			el.each(function(varvalue,varname){
				F[varname]=varvalue;
				$ES('.file_'+varname+'_'+id).each(function(t){
					t.empty();
					t.appendText(varvalue);
				});
			});
		});
	}
});
var File_Instances=[];
function File_getInstance(id){
	id=parseInt(id);
	if(!File_Instances[id])File_Instances[id]=new File(id);
	return File_Instances[id];
}
