Template.orderReceive.events({
  'click .markDeliveryReceived': function(event) {
    event.preventDefault();
    var receiptId = Session.get("thisReceipt");
    Meteor.call("receiveDelivery", receiptId, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      } else {
        var orders = StockOrders.find({"orderReceipt": receiptId}).fetch();
        if(orders && orders.length > 0) {
          orders.forEach(function(order) {
            var note = "Order receive on receipt " + receiptId;
            var quantity = order.countOrdered;
            if(order.hasOwnProperty("countDelivered")) {
              quantity = order.countDelivered;
            }
            var date = moment(date).format("YYYY-MM-DD");
            Meteor.call("updateCurrentStock", order.stockId, note, quantity, date, function(err) {
              if(err) {
                console.log(err);
                return alert(err.reason);
              }
            });

          });
        }
      }
    });
  },

  'keyup #orderReceiveNotes': function(event) {
    event.preventDefault();
    if(event.keyCode == 13) {
      var text = $(event.target).val();
      var info = {
        "receiveNote": text.trim()
      }
      Meteor.call("updateReceipt", Session.get("thisReceipt"), info, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    }
  },

  'click #uploadInvoice': function(event) {
    event.preventDefault();
    filepicker.pickAndStore(
      {mimetype:"image/*", services: ['COMPUTER']}, 
      {},
      function(InkBlobs){
        var doc = (InkBlobs);
        if(doc) {
          var url = doc[0].url;
          Meteor.call("updateReceipt", Session.get("thisReceipt"), {"invoiceImage": url}, function(err) {
            if(err) {
              console.log(err);
              return alert(err.reason);
            } else {
            }
          });
          $(".uploadedInvoiceDiv").removeClass("hide");
          $("#uploadedInvoiceUrl").attr("src", url);
          blueimpImageFullScreen();
        }
    });
  }
});