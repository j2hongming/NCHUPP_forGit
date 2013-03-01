// JavaScript Document
var req = new XMLHttpRequest();
var itemCount=new Array();
var itemName=new Array();
var currentTabHtml="";
var thead = []; //array that store head

/* Brief: Show current tab's html and extract the <table></table>.
 * Input: None.
 * Output: None.
 */
function parse_table()
{
    console.log("here");
        var myResult = currentTabHtml;
        var $table = $(myResult).find("table");
		console.log($table);
		$table.each(function(){
			$(this).find('>tbody>tr').each(function(){
				if( $(this).find('th[colspan],td[colspan]').length==0 )	//陣列沒東西
				{
					thead.push(this);
					return false;	//跳出each
				}
			});
		});
		
		$("#checked_content").html(""); // 初始內容
		$("#marked_content").html("");
		$("#risk_level").html("");
		
		if(thead.length!=0)  // 若有檢測結果
		{
			$("#checked_content").html(thead); //插入檢測結果.
		}
		else // 查無檢測結果，則秀出提醒.
		{
			$("#checked_content").html("<div style='color:red;margin-top:10px;'>Sorry, there is no table in this tabs</div>");
		}
            
}

/* Brief: Show checked result and draw charts.
 * Input: None.
 * Output: None.
 */
function show_result()
{
    if( document.getElementById("check_string").value!="")
    {
	    var riskLevel="";
        var riskNum=0;
        var myResult = req.responseText;
        var content2 = $(myResult).find("table");
		var content5 = $(myResult).find("#content");
		var content3 = $(content2).find("a");
		var content4 = $(content2).find("th");

		$(content3).each(function(index){         //取出被<a>包起來的內容
		    itemCount[index]=$(this).text();
			riskNum+=parseInt(itemCount[index],10);
		  //alert(index + ': ' + $(this).text());
		  //alert(index + ': ' + itemCount[index]);
		  });
		$(content4).each(function(index){         //取出被<th>包起來的內容
		    itemName[index]=$(this).text();
		  });  
		  
       
		$("#checked_content").html(""); // 初始內容
		if(content2.html()!=null && content2.html() !="")  // 若有檢測結果
		{
			$("#checked_content").html(content2); //插入檢測結果.
            $("#marked_content").html(content5); //插入檢測結果.			
			graphPie();							  //畫圓餅圖
			graphBar();							  //畫長條圖
			/*chrome.tabs.create({'url': chrome.extension.getURL('popup.html')}, function(tab) {
               // Tab opened.
			   alert(tab.id);
			   
               $('#checked_content').jqprint();
			   chrome.tabs.remove(tab.id, function(){});
            });*/
             riskLevel=estimateRisk(riskNum);
			$("#risk_level").html("<b>Risk Level</b>:"+riskLevel); //插入檢測結果.
		}
		else // 查無檢測結果，則秀出提醒.
		{
			$("#checked_content").html("<div style='color:red;margin-top:10px;'>抱歉，檢測結果失敗！</div>");
		}
    }            
}

/* use POST method to send check string to server and recieve result(html created by php) 
 * Input:None
 * Output:None
 */
function do_check()
{
    var check_string = "textarea="+document.getElementById("check_string").value;
	//alert(check_string);
    req.open(
        "POST",
        "http://140.120.15.146/~et055011/nchupipa/simple_catch_text.php"          
        ,false);
	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    //req.setRequestHeader("Content-length", check_string.length);
    //req.setRequestHeader("Connection", "close");	
    //req.onload = show_result;    
    req.send(check_string);
    req.onload = show_result; //when result onload, callback to show_result function 
}


/* draw a chart 
 * Input:None
 * Output: a pie chart
 */
function graphPie(){
  var data = [
    ['Heavy Industry', 10],['Retail', 9], ['Light Industry', 14], 
    ['Out of home', 16],['Commuting', 7], ['Orientation', 9]
  ];
  //模仿data格式產生資料
  var data2 = new Array();
  for(var i=0;i<(itemName.length-1);i++){
    data2[i] =  new Array();
	data2[i][0]= itemName[i]+':'+itemCount[i];
	data2[i][1]= parseInt(itemCount[i],10); //注意input的格式是數字
  }
  //alert(itemCount[0]);
  var plot1 = jQuery.jqplot ('chart1', [data2], 
    { 
      seriesDefaults: {
        // Make this a pie chart.
        renderer: jQuery.jqplot.PieRenderer, 
        rendererOptions: {
          // Put data labels on the pie slices.
          // By default, labels show the percentage of the slice.
          showDataLabels: true
        }
      }, 
      legend: { show:true, location: 'e' }
    }
  );
}
/* draw a bar 
 * Input:None
 * Output: a bar chart
 */
function graphBar(){

    var s1 = [200, 600, 700, 1000];
    var s2 = [460, -210, 690, 820];
    var s3 = [-260, -440, 320, 200];
    // Can specify a custom tick Array.
    // Ticks should match up one for each y value (category) in the series.
    var ticks = new Array();
    //模仿data格式產生資料
    var data2 = new Array();
    for(var i=0;i<(itemName.length-1);i++){
    
      data2[i]= parseInt(itemCount[i],10); //注意input的格式是數字
	  ticks[i]= itemName[i];
  }
    var plot1 = $.jqplot('chart2', [data2], {
        // The "seriesDefaults" option is an options object that will
        // be applied to all series in the chart.
        seriesDefaults:{
            renderer:$.jqplot.BarRenderer,
            rendererOptions: {fillToZero: true}
        },
        // Custom labels for the series are specified with the "label"
        // option on the series option.  Here a series option object
        // is specified for each series.
        series:[
            {label:'num'}

        ],
        // Show the legend and put it outside the grid, but inside the
        // plot container, shrinking the grid to accomodate the legend.
        // A value of "outside" would not shrink the grid and allow
        // the legend to overflow the container.
        legend: {
            show: true,
            placement: 'outsideGrid'
        },
        axes: {
            // Use a category axis on the x axis and use our custom ticks.
            xaxis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                ticks: ticks
            },
            // Pad the y axis just a little so bars can get close to, but
            // not touch, the grid boundaries.  1.2 is the default padding.
            yaxis: {
                pad: 1.12,
                tickOptions: {formatString: '$%d'}
            }
        }
    });

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


function clickHandler(e)
{
    setTimeout(do_check,10);
}

function clickGetTabHandler(e)
{
	chrome.tabs.getSelected(null, function(tab) {
	
		// Send request and receive html source code through content_script.js
		chrome.tabs.sendMessage(tab.id, {greeting: "hello"}, function(response) {
			//console.log(response.htmlsrc);
			currentTabHtml='<div>'+response.htmlsrc+'</div>';
			
			setTimeout(parse_table,10);
		});
	});
}

function initHandler(e)
{
    setTimeout(init,10);
}

/* 
 * Registers an event handler function 
 */ 
document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#check_button').addEventListener('click', clickHandler);
  document.querySelector('#gettab_button').addEventListener('click', clickGetTabHandler);
  document.querySelector('textarea').addEventListener('change', clickHandler);

});