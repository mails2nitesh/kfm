// see license.txt for licensing
function kfm_clearMessage(message){
	$('message').setStyles('text-decoration:none').innerHTML=message;
	setTimeout(kfm.hideMessage,3000);
}
function kfm_setMessage(message){
	$('message').setStyles('display:block;textDecoration:blink').innerHTML=message;
}
