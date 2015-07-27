Template.stockCountingListItem.events({
  'click .removeFromList': function(event) {
    event.preventDefault();
    var id = $(event.target).closest("li").attr("data-id");
    var gareaId = Session.get("activeGArea");
    var sareaId = Session.get("activeSArea");
    Meteor.call("removeStocksToAreas", id, gareaId, sareaId, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  }
});