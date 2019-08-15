var observer = null;

function updateListings() 
{
    console.log("Update listings");

    chrome.storage.sync.get(['activeUrls'], function(result) 
    {
        var appliedUrls = result.activeUrls || [];
        var ulItem = document.getElementsByClassName("jobs-saved-jobs__list")[0];

        if (observer == null)
        {
            observer = new MutationObserver(function(mutations) 
            {
                updateListings();
            });

            // configuration of the observer:
            var config = { attributes: true, childList: true, characterData: true };

            // pass in the target node, as well as the observer options
            observer.observe(ulItem, config);
        }

        // Go through and highlight picked ones
        for (var i = 0; i < ulItem.children.length; i++)
        {
            var liItem = ulItem.children[i];
            var url = liItem.children[0].href;
            var fixedUrl = url.substring(0, url.lastIndexOf('/') + 1);

            // Should just have two without button
            if (liItem.children.length < 3)
            {
                var button = document.createElement('input');
                button.type = "button";
                button.name = "name";
                button.value = "value";
                button.id = "id";
                button.onclick = function() 
                {
                    chrome.storage.sync.get(['activeUrls'], function(result) 
                    {
                        appliedUrls = result.activeUrls || [];
                    });
                }
                liItem.appendChild(button);
            }

            if (appliedUrls.includes(fixedUrl))
                liItem.style["background-color"] = "green";
        }
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) 
{
    if (request.action == "updatelisting")
    {
        updateListings();
    }
});

function loadFunction() 
{
    console.log(window.location.href);
    if (window.location.href === "https://www.linkedin.com/jobs/saved/")
    {
        setTimeout(() => {updateListings()}, 500);
    }
}

window.onload = loadFunction;
