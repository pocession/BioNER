$(document).ready(function() {
    var hiddenContext = $("#hiddenContext").text(),
        dHook = $("#collectionDeleteConfirm"),
        messages = {
            MSG_UNKNOWN_ID: "Unknown collection id",
            MSG_UNKNOWN_NAME: "Unknown collection name"
        },
        collectionId   = $("#collectionId").text() || messages.MSG_UNKNOWN_ID,
        collectionName = $("#collectionName").text() || messages.MSG_UNKNOWN_NAME,
        collectionUrls = {
            "deleteMembers":  hiddenContext + "/collections/deleteMembers",
            "gatherItems":    hiddenContext + "/collections/gatherItems",
            "advancedSearch": hiddenContext + "/search/advancedsearch"
        };

    $(document).on("click", ".js-collectionButtonDelete", function(e) {
        var dHead = "Collection: " + collectionName,
            dText = "",
            dWidth = "500",
            dHeight = "auto",
            idStack = [],
            idList = "",
            nameList = "",
            nameStack = [];

        e.preventDefault();

        // Run through all items to find the ones that need deletion...
        $(".deleteItems input[name=deleteItems]").each(function(index) {
            var thisItem = $(this),
                itemName;
            if (thisItem.prop("checked")) {
                idStack.push(thisItem.val());
                itemName = thisItem.closest(".list-group-item").find(".browseItemTitle a").text();
                nameStack.push(itemName);
            }
        });

        if (dHook) {
            dHook.dialog({
                autoOpen: false,
                height: dHeight,
                width: dWidth,
                modal: false,
                resizable: true,
                title: dHead
            });
        }

        if (idStack.length) {
            idList = idStack.join();
            nameList = nameStack.join("</li><li>");
            dText = "<p class='dialogText'>You have selected the following item" + (idStack.length > 1 ? "s" : "") + " for deletion from this collection:</p><ul><li>" + nameList + "</li></ul>";
            dHook.find(".js-collectionDeleteOK").show();
        } else {
            dText = "<p class='dialogText'>You have selected no items for deletion from this collection.</p>";
            dHook.find(".js-collectionDeleteOK").hide();
        }
        dHook.dialog("open");
        dHook.find(".dialogText").remove();
        dHook.find(".js-collectionDeleteDetails").html("").append(dText);
        dHook.removeClass("hide");
    });
    
    $(document).on("click", ".js-collectionDeleteOK", function(e) {
        var data = {},
            idList = "",
            idStack = [],
            collectionUrl = hiddenContext + "/search?option1=pub_collection&isJournalCollection=true&value1=" + collectionId + "&collectiontitle=" + collectionName + collectionName + "&manualCollection=true",
            submitUrl = collectionUrls.deleteMembers;

        $(".js-confirmControls button").prop("disabled", true).addClass("opacity50pc");

        $(".deleteItems input[name=deleteItems]").each(function(index) {
            var thisItem = $(this);
            if (thisItem.prop("checked")) {
                idStack.push(thisItem.val());
            }
        });
        idList = idStack.join();
        data = {
            collectionId: collectionId,
            members: idList
        };
        if (idList) {
            $.ajax({
                type: "POST",
                url: submitUrl,
                data: data,
                success: function(resp, statusText) {
                    window.location = collectionUrl;
                },
                error: function(req, statusText) {
                    alert("collectionDelete(): ERROR: " + statusText);
                }
            });
        } else {
            alert("collectionDelete(): Search Results:\n\nNo items were selected.");
        }
    });

    $(document).on("click", ".js-collectionDeleteCancel", function(e) {
        dHook.dialog("close");
    });

    $(document).on("click", ".js-collectionButtonGather", function(e) {
        var baseUrl = collectionUrls.advancedSearch,
            newUrl = baseUrl + "?from=collectionpage&collectionId=" + collectionId + "&collectionName=" + collectionName + "&manualCollection=true";
        window.location = newUrl;
    });

    $(document).on("click", "#gatherall", function(e) {
        var $here = $(this),
            $startPoint = $(".browse-listing-container");
        if ($here.prop("checked")) {
            $startPoint.find("input[type='checkbox']").prop("checked", true);
        } else {
            $startPoint.find("input[type='checkbox']").prop("checked", false);
        }
    });

    $(document).on("click", ".js-addToCollection button", function(e) {
        var data = {},
            idList = "",
            memberList = "",
            collectionId = $("#collectionId").text(),
            collectionName = $("#collectionName").text(),
            collectionUrl = hiddenContext + collectionId,
            submitUrl = collectionUrls.gatherItems;

        $(".gatherItems input").each(function(index) {
            var $thisItem = $(this);
            if ($thisItem.prop("checked")) {
                idList += index + ": " + $thisItem.val() + "\n";
                if (memberList) {
                    memberList = memberList + "," + $thisItem.val();
                } else {
                    memberList = $thisItem.val();
                }
            }
        });

        data = {
            collectionId : collectionId,
            members : memberList
        };

        if (idList) {
            $.ajax({
                type: "POST",
                url: submitUrl,
                data: data,
                success: function(resp, statusText) {
                    window.location = collectionUrl;
                },
                error: function(req, statusText) {
                    alert("Add to Collections error: " + statusText);
                }
            });
        } else {
            alert("Search Results:\n\nNo items were selected.");
        }
    });

    $(".articleMetadata").on("click", ".js-articleTitle a", function(e) {
        e.preventDefault();
            var url = $(this).attr('href'),
            datanode = $('#js-collection-info'),
            data = {
                    collectiontitle: datanode.data('collectiontitle'),
                    collectionurl: datanode.data('collectionurl')
            }; 
            //uses jquery.redirects.js
            $.redirect(url, data); 
    });
   

});
