Template.orderReceive.events({
  'click .markDeliveryReceived': function(event) {
    event.preventDefault();
    Meteor.call("receiveDelivery", Session.get("stockReceipt"), function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  }
});