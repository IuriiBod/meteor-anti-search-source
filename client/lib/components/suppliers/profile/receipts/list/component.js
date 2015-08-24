var component = FlowComponents.define("receiptsList", function(props) {});

component.state.receipts = function() {
  var receipts = OrderReceipts.find({"supplier": Session.get("thisSupplier")}, {sort: {"receivedDate": -1}});
  if(receipts) {
    var users = [];
    receipts.forEach(function(item) {
      if(item.orderPlacedBy && users.indexOf(item.orderPlacedBy) < 0) {
        users.push(item.orderPlacedBy);
      }
      if(item.receivedBy && users.indexOf(item.receivedBy) < 0) {
        users.push(item.receivedBy);
      }
    });

    if(users && users.length > 0) {
      subs.subscribe("selectedUsers", users);
    }
    return receipts;
  }
}