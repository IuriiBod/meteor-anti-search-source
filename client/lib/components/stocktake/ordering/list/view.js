Template.ordersList.events({
  'click .gotoStocktake': function(event) {
    event.preventDefault();
    var id = Session.get("thisVersion");
    Router.go("stocktakeCounting", {"_id": id});
  }
});