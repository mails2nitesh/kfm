// see license.txt for licensing
function kfm_runSearch(){
	kfm_run_delayed('search',kfm_runSearch2);
}
function kfm_runSearch2(){
	var keywords='',tags='';
	var kEl=document.getElementById("kfm_search_keywords"),tEl=document.getElementById("kfm_search_tags");
	if(kEl)keywords=kEl.value;
	if(tEl)tags=tEl.value;
	if(keywords==""&&tags=="")x_kfm_loadFiles(kfm_cwd_id,kfm_refreshFiles);
	else x_kfm_search(keywords,tags,kfm_refreshFiles)
}
function kfm_searchBoxFile(){
	var sbox=document.createElement('input');
	sbox.id='kfm_search_keywords';
	$j.event.add(sbox,'keyup',kfm_runSearch);
	return sbox;
}
