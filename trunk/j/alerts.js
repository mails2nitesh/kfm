// see license.txt for licensing
function kfm_clearMessage(message){
	setCss($('message'),'textDecoration:none').innerHTML=message;
	setTimeout('kfm_hideMessage()',3000);
}
function kfm_setMessage(message){
	setCss($('message'),'display:block;textDecoration:blink').innerHTML=message;
}
