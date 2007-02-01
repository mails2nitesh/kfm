// see ../license.txt for licensing
var kaejax_replaces_regexps=[],kaejax_replaces_replacements=[];
var kaejax_replaces={'([89A-F][A-Z0-9])':'%u00$1','22':'"','2C':',','3A':':','5B':'[','5D':']','7B':'{','7D':'}'};
for(var i in kaejax_replaces){
	kaejax_replaces_regexps.push(eval('/%'+i+'/g'));
	kaejax_replaces_replacements.push(kaejax_replaces[i]);
}
function kfm_sanitise_ajax(d){
	for(var a in window.kaejax_replaces_regexps)d=d.replace(kaejax_replaces_regexps[a],kaejax_replaces_replacements[a]);
	return d;
}
