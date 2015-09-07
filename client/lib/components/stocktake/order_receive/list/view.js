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
      };
      Meteor.call("updateReceipt", Session.get("thisReceipt"), info, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    }
  },

  'click .uploadInvoice': function(event) {
    event.preventDefault();
    filepicker.pickAndStore(
      {
        extensions:['.jpg', '.jpeg', '.png', '.doc', '.docx', '.pdf', '.xls', '.csv'], 
        services: ['COMPUTER'],
        multiple: true
      }, 
      {},
      function(InkBlobs){
        var data = (InkBlobs);
        console.log("..................", data);

        if(data && data.length > 0) {
          data.forEach(function(doc) {
            var urls = null;
            if(doc) {
              var type = null;
              var convertedUrl = null;
              if(doc.mimetype == "application/pdf") {
                type = "pdf";
              } else if(doc.mimetype == "text/csv") {
                type = "csv";
              } else {
                type = "image";
              }
              if(doc.mimetype != 'image/png') {
                convertedUrl = doc.url + "/convert?format=png";
              } else {
                convertedUrl = doc.url;
              }
              urls = {
                "originalUrl": doc.url,
                "convertedUrl": convertedUrl,
                "type": type
              };
              Meteor.call("uploadInvoice", Session.get("thisReceipt"), urls, function(err) {
                if(err) {
                  console.log(err);
                  return alert(err.reason);
                } else {
                }
              });
            }
          });
          
          // $(".uploadedInvoiceDiv").removeClass("hide");
          // $("#uploadedInvoiceUrl").attr("src", url);
          // blueimpImageFullScreen();
        }
    });
  },

  'click #viewReceipt': function(event) {
    event.preventDefault();
    $("#links").click();
  }
});