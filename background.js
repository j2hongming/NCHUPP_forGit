var req = new XMLHttpRequest(); // Create AJAX XML Request.
var background_search_result = ""; // Search result.
var background_search_keyword = ""; // Searched keyword.
var notification=null; // notificaiton object.
var itemCount=new Array();
var itemName=new Array();


// Set Desktop Notification.
function notif()
{		
	if(notification!=null) // bnotification. 
	{
		notification.cancel();
	}
	if(background_search_result!="") // 
	{
		notification = webkitNotifications.createNotification(
			'icon.png',  // icon url - can be relative
			background_search_keyword,  // notification title
			background_search_result // notification body text
		);
	}
	else // 
	{
		notification = webkitNotifications.createNotification(
			'icon.png',  // icon url - can be relative
			background_search_keyword,  // notification title
			"" // notification body text
		);
	}
	notification.show();
	
	var timeout = 20000; // Time out = 20 seconds.
	
	if(timeout > 0) 
	{      
		setTimeout(function(){
			notification.cancel();
		}, timeout);
	}
	
}

/* Brief: Fetch the searched result. Assign it into global variables then call desktop notificaiton.
*  Input: None.
*  Output: None.
*/	
function fetch_result()
{
        var riskLevel="";
        var riskNum=0;
        var myResult = req.responseText;
        var content2 = $(myResult).find("table").parent().html();
		var content5 = $(myResult).find("#content");
		var content3 = $(content2).find("a");
		var content4 = $(content2).find("th")
		

		$(content3).each(function(index){         //
		    itemCount[index]=$(this).text();
			riskNum+=parseInt(itemCount[index],10);
		  //alert(index + ': ' + $(this).text());
		  //alert(index + ': ' + itemCount[index]);
		  });
		$(content4).each(function(index){         //
		    itemName[index]=$(this).text();
		  });  
		riskLevel=estimateRisk(riskNum);
		  
        background_search_result=content2;
		
		var messageData = "";
	if(background_search_result=="")  // 若查無單字翻譯
	{
		messageData = "<br /><span style='color:red;'>查無此翻譯！</span>";
	}
	else
		messageData = background_search_result;
	/* Send message to grab_event.js. */
	chrome.tabs.getSelected(null, function(targetTab) {
			chrome.tabs.sendMessage(targetTab.id, {data: messageData, keyword: background_search_keyword, risk: riskLevel}, function(response) {
			
		});
	});
     
	
	//notif();
}

/* Brief: Grab right click object.
*  Input: info -  the chrome info object.
*         tab - the current tab object.
*  Output: none.
*/
function searchOnClick(info, tab) {
	if(info.linkUrl==null) //假如沒有linkUrl
	{
		background_search_keyword = info.selectionText;
		setTimeout(background_search,10);
	}

}

/* Brief: Background search for  by AJAX
 * Input: none.
 * Output: none.
 */
function background_search()
{
  var check_string = "textarea="+background_search_keyword;
  req.open(
        "POST",
        "http://140.120.15.146/~et055011/nchupipa/simple_catch_text.php"          
        ,false);
	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    //req.setRequestHeader("Content-length", check_string.length);
    //req.setRequestHeader("Connection", "close");	
    //req.onload = show_result;    
    req.send(check_string);
    req.onload = fetch_result; //when result onload, callback to show_result function 
    
}

function estimateRisk(dangerNum){
    var dangerLevel="";
	if(dangerNum<=5){
		dangerLevel="<font color='green'>low</font>";
	}
	else if(dangerNum<=10){
		dangerLevel="<font color='yellow'>median</font>";
	}
	else{
	    dangerLevel="<font color='red'>high</font>";
	}
	return dangerLevel;
}

// Set title of the context menu.
var title = "check the selection ";
// Create context menu.
chrome.contextMenus.create({"title":title, "contexts":['selection'],"onclick":searchOnClick});