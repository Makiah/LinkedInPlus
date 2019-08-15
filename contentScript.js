function updateListings() 
{
    chrome.storage.sync.get(['activeUrls'], function(result) 
    {
        var appliedUrls = result.activeUrls || [];
        var ulItem = document.getElementsByClassName("jobs-saved-jobs__list")[0];

        for (var i = 0; i < ulItem.children.length; i++)
        {
            var liItem = ulItem.children[i];
            var url = liItem.children[0].href;
            var fixedUrl = url.substring(0, url.lastIndexOf('/') + 1);

            if (appliedUrls.includes(fixedUrl))
                liItem.style["background-color"] = "green";
        }
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) 
{
    console.log("Update listings");
    if (request.action == "updatelisting")
    {
        updateListings();
    }
});
