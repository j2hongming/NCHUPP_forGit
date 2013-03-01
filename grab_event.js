var myChromeRightClickElement = null; // right click web element.
var myChromeEventLocationX = 0;
var myChromeEventLocationY = 0;
var myChromeSelectedElement = null; // right click selected text.
var myChromeRightClickEvent = null; // right click event.
var myChromeNotification = null;
var myChromeDictionaryTimer = null;
var myChromeImagePath = chrome.extension.getURL("icon-small.png"); // Logo.
/*
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    //alert(request.greeting);	
	// 先關閉Tool tip.
	if(myChromeDictionaryTimer!=null)
	{
		clearTimeout(myChromeDictionaryTimer);
	}
	$(".personal_tooltip").remove();	
	myChromeNotification = $("<span class='personal_tooltip'><div class='header'><img src='"+myChromeImagePath+"' width='16px' height='16px' /><div class='close_personal_tooltip'>[X]</div></div><div>"+request.keyword+"</div><div class='personal_content'>"+request.data+"</div><div class='personal_risk'><b>Risk Level:</b>"+request.risk+"</div></span>");	
	$("body").prepend(myChromeNotification);	
	// Default 30 seconds.
	myChromeDictionaryTimer = setTimeout(function() { myChromeNotification.fadeOut("fast"); },30000);
	$(".close_personal_tooltip").click(function() { $(this).parent().parent().fadeOut("fast"); });

	sendResponse({request:"OK"});
});
*/