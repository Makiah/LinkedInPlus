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

            var alreadyApplied = appliedUrls.includes(fixedUrl);
            if (alreadyApplied)
                liItem.style["background-color"] = "green";
            else 
                liItem.style["background-color"] = "initial";

            // Should just have two without button
            if (liItem.children.length < 3)
            {
                var button = document.createElement('input');
                button.type = "button";
                button.name = "name";
                button.value = (alreadyApplied ? "Applied" : "Not Applied");
                button.id = "id";
                button.style["background-color"] = "rgb(200, 200, 200)";
                button.linkedInUrl = fixedUrl;
                button.liItem = liItem;
                button.onclick = function() 
                {
                    console.log("Got onclick for " + this.linkedInUrl);
                    var linkedInUrl = this.linkedInUrl;
                    var thisLiItem = this.liItem;
                    var thisButton = this;

                    chrome.storage.sync.get(['activeUrls'], function(result) 
                    {
                        var appliedUrls = result.activeUrls || [];
                        console.log("Applied URLs", appliedUrls);

                        var index = appliedUrls.indexOf(linkedInUrl);
                        if (index > -1)
                        {
                            // Toggle to not applied
                            thisButton.value = "Not Applied";

                            appliedUrls.splice(index, 1);
                            console.log("Spliced out");

                            thisLiItem.style["background-color"] = "initial";

                            chrome.storage.sync.set({activeUrls: appliedUrls});
                        }
                        else
                        {
                            thisButton.value = "Applied";

                            appliedUrls.push(linkedInUrl);
                            console.log("Pushed in");

                            thisLiItem.style["background-color"] = "green";

                            chrome.storage.sync.set({activeUrls: appliedUrls});
                        }
                    });
                }
                liItem.appendChild(button);
            }
        }
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) 
{
    if (request.action == "updatelisting")
    {
        observer = null;
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
