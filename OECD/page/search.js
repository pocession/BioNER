       
$(document).ready(function() {   
	
    // Triggers a concept search...
    var searchTerm = $("#sortForm input[name='value1']").val();
    
    /*
    var conceptSearchUrl = $("#hiddenContext").text() + "/search/contentTypeOnlyAhahSearch?value1=" + searchTerm + "&option1=conceptsearch&shouldSave=false&noRedirect=true";
    $.ajax({
        type     : "GET",
        url      : conceptSearchUrl,
        success  : function(resp, statusText) {
            // If no results then remove entire section...
            if (resp.indexOf("noConceptSearchResults") != -1) {
                $(".conceptSearchResultsContainer").remove();
            } else {
                $(".conceptSearchResultsContainer").append(resp);
            }
        },
        error    : function(req, statusText) {
            $(".conceptSearchResultsContainer").remove();
        },
        complete : function(req, statusText) {
            $(".conceptSearchResultsLoading").remove();
        }
    });
	*/
	/* export citation functionality */
    $("#exportbutton").click(function() {
	    if ($("#exportselect").val() != "") {
	    	var exportCitationsForm = $(this).parents('form[name=exportcitations]');
	    	$(exportCitationsForm).find('input[name=exportcitation]').remove();
	    	var checkedcheckboxes = $('.searchResultItemCheckbox').children('input[name=exportcitation]:checked');
	    		
	    	if ($(checkedcheckboxes).length){
	    		
	    		$(checkedcheckboxes).clone().appendTo(exportCitationsForm).addClass('hidden');
	    		
	    		$(exportCitationsForm).attr('target','_blank');
	    		return true;
	    	} else {
	    		alert ("Please check the search results that you wish to export as citations");
	    	}
	    	
	    } else {
	    	alert ("Please select an export option.");
	    }
	    return false;
    });

    /* removes link from doi? */
    // $('.doi > .externallink').contents().unwrap();
    
    /* ==========================================================================*/
    /* search within box - default text 
    $(".searchWithinInputBox ").focus(function(){
    	var defaultSearchTerm = "Refine search results";
		var searchBoxValue = $(this).val();
		var indexOftheStringis =  searchBoxValue.indexOf(defaultSearchTerm)
		// console.log(searchBoxValue);
		// console.log(indexOftheStringis);
		if (indexOftheStringis > -1) {
			$(this).val("").removeClass("lightgrey");
		}
	}).blur(function(){
		defaultSearchTerm = "Refine search results";
		searchBoxValue = $(this).val();
        if (searchBoxValue === '') {
        	$(this).addClass("lightgrey").val(defaultSearchTerm);
        }	
    }); */

    
    doubleTitleLinks();
    /* ==================================
    double icon issue on search results due to title having link it in.
    ========================================
  $("[target='xrefwindow']").each(function(){
  
	var thisParent = $(this).parent();
	$(this).wrap("<span class='wrapTitle'></span>");
     $(".wrapTitle").prev().addClass("emptyHref"); 
	});

  // remove the link for the doi part of the title
   $("[target='xrefwindow']").children(".jp-italic").unwrap("<a></a>");

 // look through each empty href (due to an internal href in title)  
  $(".emptyHref").each(function(){
		var hrefT = $(this).attr("href");
		//$(this).parent().append($(this).attr("href"));
		$(this).parent().wrapInner("<a href='' class='newLinkWrapper'></a>");
		$(this).parent().attr("href",hrefT);

		$(this).remove();

	});
  ==========================================================================*/

    
    
    
    
    
    
    
    
    /* ==========================================================================*/
    /* sorting functionality - relevance */
    
 


 
    $("#sortRelevance").click(function() {
        var sortForm = $("#sortForm");
        sortForm.find("input[name=sortField]").val('default');
        sortForm.find("select[name=sortDescending]").val('').change();
        //ok this triggers the change function below that submits the form.
        //sortForm.submit();
        return false;
    });
    /* sorting functionality - oldest first */
    $("#sortOldest").click(function() {
        var sortForm = $("#sortForm");
         sortForm.find("input[name=sortField]").val('prism_publicationDate');
         sortForm.find("select[name=sortDescending]").val('false').change();
       //ok this triggers the change function below that submits the form.
        return false;
    });
    /* sorting functionality - newest first */
	$("#sortNewest").click(function() {
	    var sortForm = $("#sortForm");
	    sortForm.find("input[name=sortField]").val('prism_publicationDate');
	    sortForm.find("select[name=sortDescending]").val('true').change();
	  //ok this triggers the change function below that submits the form.
        return false;			                
    });
    /* sorting functionality - title */
    $("#sortByTitle").click(function() {
        
        sortForm.find("input[name=sortField]").val('sortTitle');
        sortForm.find("select[name=sortDescending]").val('false').change();
      //ok this triggers the change function below that submits the form.
        return false;
    });
    
    $("#sortMobile").change(function(){
        
        var sortForm = $("#sortForm");
        if (sortForm.find("input[name=sortField]").length == 0 && ($(this).val('true') || $(this).val('false'))){
            sortForm.append("<input type='hidden' name='sortField' value='prism_publicationDate' />");
        }
        sortForm.submit();
        
    });
    
    
    /* ajax section - view less */
    $("#bellowheadercontainer").on("click", ".toggleajaxfacetitem a", function() {
    	var hiddenFacets = $(this).parent().siblings(".ajaxhidden");
        
        $(this).parent("li").find("a").toggle();
        //console.log("hide");
        if (hiddenFacets.css("display") == "none") {
        	//hiddenFacets.css("display", "block")
        	$(this).parent().siblings(".ajaxhidden").show();
        } else {
        	//hiddenFacets.css("display", "none");
        	$(this).parent().siblings(".ajaxhidden").hide();
        }
        return false; 
    });
    
 


	
	  /*
	  * re-order authors to be alphabetical when more/show more is clicked.
	  */
	$(".author-link").click(function(){
		
		var items = $("ul.author li").get();
		console.log("items= " + items);
		items.sort(function(a,b){
			var keyA = $(a).text();
			var keyB = $(b).text();
			
			if (keyA < keyB) return -1;
			if (keyA > keyB) return 1;
			return 0;
		});
		var ul = $("ul.author");
		$.each(items, function(i,li){
			ul.append(li)
		});
		
	});
	
 
// see custome.js 'js-arrow_ocde'	
//	$(".searchResultsContainerInner").on("click", ".js-plus", function(e) {
//	    // Update target for 'Add to Favourites'
//	    var here = $(this),
//	        newUrl = "",
//	        hiddenContext = $("#hiddenContext").text(),
//        	itemid = here.closest(".js-browse-item").find(".js-access-determined, .js-access-in-the-process-of-being-determined").data("itemid"),
//	        ahahUrl = hiddenContext + "/content/ahahsearch?shouldSave=false";
//	        
//	    e.preventDefault();
//	    // Pass in where we are first...
//	    ECApp.showDescription(this, "js-itemDescription", ahahUrl, "js-title");
// 
//      eventLogUrl = $("meta[name='stats-meta']").data("logstatisticsurl"); 
//      eventData = {
//        "eventType": "INVESTIGATION",
//        "eventProperties.ITEM_ID": itemid,
//          "eventProperties.SOURCE": "SEARCH",
//      };
//      //console.log(eventData);
//      $.ajax({
//        url: eventLogUrl,
//        type: "GET",
//        data: eventData,
//        success: function(resp, statusText) {
//        },
//        error: function(req, statusText, errorThrown) {
//        }
//      });
//	});
	
	// paginated between facet topics 
	$(".search-facet-mobile-container .facets h3").click(function(){
	    var facetHeading = $(".facets h3");
	    var facetList = $(".list-facet-by");
	    var $this = $(this);
	    var mobileView = $this.find("span.heading-filter-by");
	    var currentHeadingPosition = facetHeading.index($(this));
	    console.log("currentHeadingPosition " + currentHeadingPosition);
	    var mobileFacetsHidden = mobileView.is(':hidden');
	    console.log("mobileFacetsHidden" + mobileFacetsHidden);
	    
	    if (mobileFacetsHidden){
	        
	        //$(".search-facet-mobile-container .facets h3").css({position:'absolute'}).animate({left:'-800px'});
	        $(".search-remove-filter").animate({left:'-800px'}, function(){
	            $(".search-remove-filter").hide();
	        });
	        facetHeading.animate({left:'-800px'},function(){
	            facetHeading.hide();
	            
	                        
	                        facetList.eq(currentHeadingPosition).toggleClass("hiddenFacetList");
	                        facetList.hide();
	                        facetList.eq(currentHeadingPosition).show();
	                        facetList.eq(currentHeadingPosition).animate({
	                            left:"0px"
	                        });
	                        
	                    
	        });
	        
	        $(".heading-facet-mobile").removeClass("facet-list-open");
	        $(".heading-facet-mobile").addClass("facet-listed-view");       
	        
	    }
	});
	
	$(".js-save-this-search").on("click", function(e){
	       e.preventDefault();
	       if(typeof URL === "function") {
	        var parsedUrl = new URL(window.location.href);
	        var searchTerm = parsedUrl.searchParams.get("value1");
	           if (searchTerm) {
	            dataLayer.push({"customCategory" :"engagement",
	                "customAction":"saveThisSearch",
	                 "customLabel": searchTerm,
	                  "event":"customEvent"});
	           }
	       }
	           // normal function of link after that.
	           ingentaCMSApp.followLink($(this));
	   });
	
	
	$("#searchResultsContainer").on('click', '.search-metaitem h5.search_title a', function(e){
	    e.preventDefault();
	        var searchType = ''    
	        if(typeof URL === "function") {
	            var parsedUrl = new URL(window.location.href);
	            searchType = parsedUrl.searchParams.get("searchType");
	        }
	        var previousResultCount = $(this).closest('.resultItem.table-row')
	                                      .prevAll('.resultItem.table-row').length;
	        
	       if (searchType == 'quick') {
	        dataLayer.push({"customCategory" :"navigation",
                "customAction":"internalSearchPosition",
                "customLabel": (previousResultCount + 1),
                 "event":"customEvent"});
	       } else if (searchType == 'advanced') {
	           dataLayer.push({"customCategory" :"navigation",
	                "customAction":"advancedInternalSearchPosition",
	                "customLabel": (previousResultCount + 1),
	                 "event":"customEvent"});
	       }
	       
	       // normal function of link after that.
	       ingentaCMSApp.followLink($(this));
	    
	});
		
		
});


/* replace the text for facets to match global*/
function moreLessUpdate() {
	$(".facetshowtext").html("[+] More");
	$(".facethidetext").html("[&ndash;] Less");
}





