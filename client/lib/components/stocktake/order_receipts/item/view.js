Template.orderReceiptItem.events({
  'click .receiveDelivery': function (event) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    if (id) {
      Router.go("orderReceive", {"_id": id});
    }
  }
});