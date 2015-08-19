Template.orderReceive.events({
  'click .markDeliveryReceived': function(event) {
    event.preventDefault();
    Meteor.call("receiveDelivery", Session.get("thisReceipt"), function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
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
    filepicker.pickAndStore({mimetype:"image/*"}, {},
      function(InkBlobs){
        var doc = (InkBlobs);
        if(doc) {
          var url = doc[0].url;
          Meteor.call("updateReceipt", Session.get("thisReceipt"), {"invoiceImage": url}, function(err) {
            if(err) {
              console.log(err);
              return alert(err.reason);
            }
          });
          $(".uploadedInvoiceDiv").removeClass("hide");
          $("#uploadedInvoiceUrl").attr("src", url);
        }
    });
  }
});