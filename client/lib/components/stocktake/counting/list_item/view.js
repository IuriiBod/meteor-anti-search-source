Template.stockCountingListItem.events({
  'click .removeFromList': function(event) {
    event.preventDefault();
    var confrimDelete = confirm("This action will remove this stock item from this area. Are you sure you want to continue?");
    if(confrimDelete) {
      var id = $(event.target).closest("li").attr("data-id");
      var sareaId = Session.get("activeSArea");
      var stockRefId = $(event.target).closest("li").attr("data-stockRef");
      var stocktake = Stocktakes.findOne(stockRefId);
      if(stocktake) {
        if(stocktake.status || stocktake.orderRef) {
          return alert("Order has been created. You can't delete this stocktake item.")
        }
      }

      Meteor.call("removeStocksFromAreas", id, sareaId, stockRefId, function(err) {
        if(err) {
          HospoHero.error(err);
        }
      });
    }
  }
});