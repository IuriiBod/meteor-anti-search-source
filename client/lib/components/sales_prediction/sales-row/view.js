Template.predictionSalesRow.onRendered(function () {
  if(MenuItems.find().count()<11){
    $("#loadMoreBtn").addClass("hide");
  }
});
