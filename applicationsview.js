var optionList = document.getElementById("applications");

var activeUrls;

function updateActiveUrlList() 
{
    chrome.storage.sync.get(['activeUrls'], function(result) 
    {
        var index = 0;
        optionList.innerHTML = "";
        activeUrls = result.activeUrls;
        activeUrls.forEach((activeUrl) => 
        {
            var liItem = document.createElement('li');
            var liItemLabel = document.createElement('span');
            liItemLabel.innerHTML = activeUrl;
            var liItemDelete = document.createElement('button');
            liItemDelete.innerHTML = "Delete";
            liItemDelete.linkedInIndex = index;
            liItemDelete.onclick = function() 
            {
                deleteAtIndex(this.linkedInIndex);
            }
            liItem.appendChild(liItemLabel);
            liItem.append(liItemDelete);
            optionList.appendChild(liItem);
            index++;
        });
    });
}

function deleteAtIndex(index) 
{
    console.log("deleteAtIndex(" + index + "): " + activeUrls[index]);
    activeUrls.splice(index, 1);

    chrome.storage.sync.set({activeUrls: activeUrls}, function () 
    {
        updateActiveUrlList();
    });
}

updateActiveUrlList();