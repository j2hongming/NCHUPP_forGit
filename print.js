var oScript = document.createElement("script");//�Ыؤ@��Script����
oScript.src = "jqprint-0.3.js";//��wsrc�ݩ�


function do_print(){
  /*$(document).ready(function(){
		    alert("print here");
            $('body').jqprint();		   
          
		});*/
		//alert("print here");
		chrome.tabs.update(tab.id, {url: action_url});
            $('body').jqprint();
}

/*
function clickPrint(e){
    setTimeout(do_print,10);
}
*/
/* Registers an event handler function 
 */
//document.addEventListener('DOMContentLoaded', function () {
  //document.querySelector('#print').addEventListener('click', clickPrint);
  document.querySelector('#print').addEventListener('click', function(){
    alert("print here2");
    var action_url = "javascript:window.print();";
    chrome.tabs.update(tab.id, {url: action_url});
	//$("body").jqprint();
  });
//});
