//註冊 onMessage事件，當有人發送Message時，傳回目前tab的html
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      sendResponse({htmlsrc: document.body.outerHTML}); //document.body.outerHTML must be a problem
  });
