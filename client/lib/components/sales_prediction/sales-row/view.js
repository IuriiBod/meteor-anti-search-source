Template.predictionSalesRow.onRendered(function () {
  var maxItemsToHideBtn = 10;
  if(MenuItems.find().count()<=maxItemsToHideBtn){
    $("#loadMoreBtn").addClass("hide");
  }
});
