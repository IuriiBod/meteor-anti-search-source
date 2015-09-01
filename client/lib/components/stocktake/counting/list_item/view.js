Template.stockCountingListItem.events({
  'click .removeFromList': function(event) {
    event.preventDefault();
    var confrimDelete = confirm("This action will remove this stock item from this area. Are you sure you want to continue?");
    if(confrimDelete) {
      var id = $(event.target).closest("li").attr("data-id");
      var sareaId = Session.get("activeSArea");
      Meteor.call("removeStocksFromAreas", id, sareaId, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        } else {
          var stockRefId = $(event.target).closest("li").attr("data-stockRef");
          if(stockRefId) {
            Meteor.call("removeStocktake", stockRefId, function(err) {
              if(err) {
                console.log(err);
                return alert(err.reason);
              }
            });
          }
        }
      });
    }
  }
});