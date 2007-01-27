// see license.txt for licensing
	var kfm_directory_over=0;
	if(!window.kfm_callerType)window.kfm_callerType='standalone';
	var browser=new Browser(),loadedScripts=[],kaejax_is_loaded=0,function_urls=[];
	var kfm_cwd_name='',kfm_cwd_id=0,kfm_cwd_subdirs=[],contextmenu=null,selectedFiles=[],kfm_imageExts=['jpg','jpeg','gif','png','bmp'];
	var kfm_filesCache=[],kfm_tags=[],kfm_tracers=[],kfm_tracer_v=10,kfm_lastClicked,kfm_unique_classes=[];
	var kaejax_timeouts=[],kfm_directories=[0,{name:'root',pathname:'/'}];
