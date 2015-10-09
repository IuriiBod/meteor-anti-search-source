Template.ordersListItem.events({
  'click .removeStockOrder': function(event) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    var confirmDelete = confirm("Are you sure you want to delete this order ?");
    if(confirmDelete && id) {
      Meteor.call("removeOrder", id, function(err) {
        if(err) {
          HospoHero.alert(err);
        }
      });
    }
  }
});
