// For SPA
chrome.webNavigation.onHistoryStateUpdated.addListener(function()
{
    console.log("update history state");
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) 
    {
        if (tabs[0].url === "https://www.linkedin.com/jobs/tracker/saved/")
        {
            console.log("it's the right one");
            setTimeout(() => chrome.tabs.sendMessage(tabs[0].id, 
            {
                action: "updatelisting"
            }), 
            500);
        }
    });
});