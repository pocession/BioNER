function getCommentCount(xhr) {
	var hiddenContext = $("#hiddenContext").text(),
		appUrls = {
			"commentcount1":    hiddenContext + "/commenting/comments/commentscount.action",
			"commentcount2":    hiddenContext + "/commenting/comments/jsoncommentscount.action"
		},
		resp = jQuery(xhr.responseText),
		articleIds = $(resp).find("input[name='articleIds']").val(),
		arrLen = 0,
		cmtHtml = "",
		commentUrl = "",
		currItem,
		currCount,
		currTitle,
		dataStr = "",
		i = 0,
		idArr = [],
		idList = "",
		mStr = "",
		respLen = 0,
		tmp = 0,
		$target;
		
	if (articleIds) {
		//console.log(articleIds);
		$("input[name='articleIds']").val(articleIds);
		
		if ($(".showCommentsCounts").length > 0) {
		
			if ($(".ahahTocArticles").length) {
				idList = $("input[name='articleIds']").val();
				if (idList) {
					idArr = idList.split(",");
					arrLen = idArr.length;
					for (i = 0; i < arrLen; i++) {
						dataStr += "itemId=" + idArr[i] + "&";
					}
					commentUrl = appUrls.commentcount2;
					$.ajax({
						type : "POST",
						url : commentUrl,
						data : dataStr,
						success : function(commentresp, statusText) {
							if (commentresp) {
								respLen = commentresp.length;
								for (i = 0; i < respLen; i++) {
									currCount = commentresp[i].cmtcount;
									currItem = commentresp[i].itemId;
									if (currCount > 0) {
										// Split the itemId
										tmp = currItem.indexOf("/content");
										if (tmp !== -1) {
											mStr = hiddenContext + currItem.substr(tmp);
											$target = $(".articleTitle").find("a[href='" + mStr + "']");
											if ($target.length > 0) {
												cmtHtml = "";
												cmtHtml += "<span class='bookmark-separator'>";
												cmtHtml += "<img src='/images/" + ingentaCMSApp.instanceprefix + "/icons_separator.png' width='2' height='16' />";
												cmtHtml += "</span><img src='/images/" + ingentaCMSApp.instanceprefix + "/comment_icon_display.png' alt='' />";
												cmtHtml += "<span class='commentCount'>(" + currCount + ")</span>";
												$target.append(cmtHtml).hide().fadeIn(SABINETApp.fades.medium);
											}
										}
									}
								}
							}
						},
						error : function(req, statusText) {
							if (SABINETApp.consoleOK) {console.log("showCommentsCount(): Error '" + statusText + "'...");}
						}
					});
				}
			}
		}
	}
}

$(document).ready(function(){	
	var nextPageLink = $('.paginator').find('a:contains("Next >")').attr('href'),
	currentSearchBaseURL = window.location.search;
	var see_more = $('.search-see-more').text();  
	var no_result = $('.search-no-results').text();
	var no_More_Results = $('input[name="no_moreitems"]').val();
	

    ECApp.displayAccessIcons("resultItem", "itemDescription", 
        $("#hiddenContext").text()+"/content/ahahsearch?shouldSave=false", "title", "");
	
	if (!nextPageLink) {
		$(".search-see-more").prop("disabled", true).html(no_More_Results);
	}
	$("#listItems").append('<input id="nextPageLink" type="hidden" value="'+nextPageLink+'" name="nextPageLink">');
		 
	
    $(".search-see-more").click(function(){
		$("#listItems").find('.search-see-more-container').prepend('<img style="display: block" src="/images/instance/loader.png" class="loader loader-center"/>');
		$(".search-see-more")
		    .prop("disabled", true)
		       .text("Loading...");
		
		    
		var nextLink = $("#nextPageLink").val();
		if (nextLink.indexOf("fmt=ahah") == -1) {
			var noAhah = $("#noAhah").val();
			//console.log(noAhah);			
			if (!noAhah) {
				nextLink = nextLink + '&fmt=ahah';
			}
		}
		if (nextLink) {
		$.ajax({
			type: "GET",
			url: nextLink,
			timeout: 90000,
			success: function(resp, statusText) {
			    
	             var totalNumOfItemsOnPage = parseInt($("#totalNumOfItemsOnPage").val()) + parseInt($("#defaultPageSize").val());
	                 currentPageNum = parseInt($("#currentPageNum").val()) + 1,
	                 totalNumOfItems = $("#totalNumOfItems").val(),
	                 updatedExaplanation = '1 - ' + (totalNumOfItemsOnPage < totalNumOfItems ?  totalNumOfItemsOnPage.toLocaleString() : totalNumOfItems.toLocaleString()) + ' of ';
			    
			    $('.ahahTocArticles').remove(); //remove the existing ID's for the display of access icons we will then append the new ID's
			    
				$(".search-see-more").prop("disabled", false).html(see_more);
				
				//append a parameter on to the URL so if the page gets reloaded it still shows the same number of results. Also allows back / forward functionality
				// There could be some cases where we are forwarding the request to search URL from search index pages for books, papers, themes etc. 
				var pageSizeParam=null;
				if(currentSearchBaseURL) {
					pageSizeParam="&pageSize="
				}
				else {
					pageSizeParam="?pageSize="
				}
				history.pushState(null, "page " + currentPageNum, currentSearchBaseURL  + pageSizeParam  + totalNumOfItemsOnPage);
				
				var items = $(resp).find("#listItems .searchResultsContainerInner .table-row");
				
				
				nextLink = $(resp).find('.paginator a:contains("Next >")').attr('href');
				$("#listItems #nextPageLink").val(nextLink);
				$("#listItems .searchResultsContainerInner").append(items);
				
				
				
				$("img.urlnotprovided").attr("src", "/images/" + ingentaCMSApp.instanceprefix + "/placeholder-image.jpg");
				
				//update values for hidden input fields to reflect newly added results.
				$("#totalNumOfItemsOnPage").val(totalNumOfItemsOnPage);
				$("#currentPageNum").val(currentPageNum);

					$(".explanationText").find('[data-resultcount="true"]').text(updatedExaplanation);

				if (!nextLink) {
					$(".search-see-more").prop("disabled", true).html(no_result);
				}
				
				ingentaCMSApp.displayElipsisDescription();
				

					ECApp.displayAccessIcons("resultItem", "itemDescription", 
						$("#hiddenContext").text()+"/content/ahahsearch?shouldSave=false", "title", "");
				
			},
			error: function(req, statusText, message) {
			},
			complete: function(req, statusText) {
				$(".loader").remove();
				getCommentCount(req);
				
				// if ALL previous descriptions have been opened then new search results added also get the same treatment. 
				if ($(".search-results-options-container .showAllDescriptions").css("display") == 'none' && 
					$(".search-results-options-container .hideAllDescriptions").css("display") !== 'none') {
					$(".showAllDescriptions").trigger("click");
				}else {
					$(".search-results-options-container .showAllDescriptions").hide();
				}
			}
		});
		}	
				
    });
});