var appliedUrls = []; 
var currentUrl;

var unappliedContainer = document.getElementById("unapplied");
var appliedContainer = document.getElementById("applied");
var markListingsButton = document.getElementById("markListings");

function onWindowLoad() 
{
    appliedContainer.style.display = "none";
    unappliedContainer.style.display = "none";
    markListingsButton.style.display = "none";

    chrome.storage.sync.get(['activeUrls'], function(result) 
    {
        appliedUrls = result.activeUrls || [];

        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) 
        {
            currentUrl = tabs[0].url;

            if (currentUrl === "https://www.linkedin.com/jobs/saved/")
            {
                markListingsButton.style.display = "block";
            }
            else
            {
                if (appliedUrls.includes(currentUrl))
                {
                    appliedContainer.style.display = "block";
                }
                else
                {
                    unappliedContainer.style.display = "block";
                }
            }
        });
    });
}

window.onload = onWindowLoad;

function markApplied() 
{
    var index = appliedUrls.indexOf(currentUrl);
    appliedContainer.style.display = "block";
    unappliedContainer.style.display = "none";

    if (index == -1)
    {
        appliedUrls.push(currentUrl);

        chrome.storage.sync.set({activeUrls: appliedUrls});
    }
    else 
    {
        console.error(currentUrl + " was already in appliedUrls but markApplied() was called!");
    }
}

function markUnapplied() 
{
    console.log("markUnapplied()");

    var index = appliedUrls.indexOf(currentUrl);
    appliedContainer.style.display = "none";
    unappliedContainer.style.display = "block";

    if (index > -1)
    {
        appliedUrls.splice(index, 1);

        chrome.storage.sync.set({activeUrls: appliedUrls});
    }
    else
    {
        console.error(currentUrl + " was not found in appliedUrls but markUnapplied() was called!");
    }
}

function markListings() 
{
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) 
    {
        chrome.tabs.sendMessage(tabs[0].id, 
        {
            action: "updatelisting"
        });
    });
}

document.getElementById("markUnapplied").addEventListener("click", markUnapplied);
document.getElementById("markApplied").addEventListener("click", markApplied);
markListingsButton.addEventListener("click", markListings);
