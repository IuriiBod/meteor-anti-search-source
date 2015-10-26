Template.orderReceive.events({
  'click .markDeliveryReceived': function(event) {
    event.preventDefault();
    var receiptId = Session.get("thisReceipt");
    Meteor.call("receiveDelivery", receiptId, HospoHero.handleMethodResult());
  },

  'keyup #orderReceiveNotes': function(event) {
    event.preventDefault();
    if(event.keyCode == 13) {
      var text = $(event.target).val();
      var info = {
        "receiveNote": text.trim()
      };
      Meteor.call("updateReceipt", Session.get("thisReceipt"), info, HospoHero.handleMethodResult());
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
              } else if(doc.mimetype == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || doc.mimetype == "application/msword") {
                type = "doc";
              } else {
                type = "image";
              }
              urls = {
                "originalUrl": doc.url,
                "type": type
              }

              if(type == "doc") {
                urls['originalUrl'] = doc.url + "/convert?format=pdf";
              }

              //converting url to image
              var blob = {
                url: doc.url,
                mimetype: 'image/png',
                isWriteable: false,
                size: 28683
              };

              filepicker.convert(
                blob,
                {
                  width: 200,
                  height: 200,
                  format: 'png',
                  compress: true,
                  quality: 100
                },
                function(new_Blob){
                  urls['convertedUrl'] = new_Blob.url;
                  Meteor.call("uploadInvoice", Session.get("thisReceipt"), urls, HospoHero.handleMethodResult());
                }
              );
            }
          });          
        }
    });
  }
});