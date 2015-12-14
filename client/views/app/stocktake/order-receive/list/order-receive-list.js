Template.orderReceive.onCreated(function() {
  this.currentOrder = new ReactiveVar(null);
});

Template.orderReceive.helpers({
  list: function() {
    var data = StockOrders.find({"orderReceipt": this.currentReceipt, "countOrdered": {$gt: 0}});
    if (data) {
      return data;
    }
  },

  total: function() {
    var orders = StockOrders.find({"orderReceipt": this.currentReceipt}).fetch();
    var cost = 0;
    if (orders.length > 0) {
      orders.forEach(function (order) {
        cost += parseFloat(order.countOrdered) * parseFloat(order.unitPrice)
      });
    }
    return cost;
  },

  receipt: function() {
    var data = OrderReceipts.findOne({_id: this.currentReceipt});
    if (data) {
      return data;
    }
  },

  isReceived: function() {
    var data = OrderReceipts.findOne({_id: this.currentReceipt});
    if (data) {
      if (data.received) {
        return true;
      }
    }
  },

  receivedNote: function() {
    var receipt = OrderReceipts.findOne({_id: this.currentReceipt});
    if (receipt) {
      return receipt.receiveNote;
    }
  },

  currentOrderCallback: function() {
    var instance = Template.instance();
    return function (orderId) {
      instance.currentOrder.set(orderId);
    }
  },

  currentOrder: function() {
    return Template.instance().currentOrder.get();
  }
});

Template.orderReceive.events({
  'click .markDeliveryReceived': function (event, tmpl) {
    event.preventDefault();
    var receiptId = tmpl.data.currentReceipt;
    Meteor.call("receiveDelivery", receiptId, HospoHero.handleMethodResult());
  },

  'keyup #orderReceiveNotes': function (event, tmpl) {
    event.preventDefault();
    if (event.keyCode == 13) {
      var text = $(event.target).val();
      var info = {
        "receiveNote": text.trim()
      };
      Meteor.call("updateReceipt", tmpl.data.currentReceipt, info, HospoHero.handleMethodResult());
    }
  },

  'click .uploadInvoice': function (event, tmpl) {
    event.preventDefault();
    filepicker.pickAndStore(
      {
        extensions: ['.jpg', '.jpeg', '.png', '.doc', '.docx', '.pdf', '.xls', '.csv'],
        services: ['COMPUTER'],
        multiple: true
      },
      {},
      function (InkBlobs) {
        var data = (InkBlobs);

        if (data && data.length > 0) {
          data.forEach(function (doc) {
            var urls = null;
            if (doc) {
              var type = null;
              var convertedUrl = null;
              if (doc.mimetype == "application/pdf") {
                type = "pdf";
              } else if (doc.mimetype == "text/csv") {
                type = "csv";
              } else if (doc.mimetype == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || doc.mimetype == "application/msword") {
                type = "doc";
              } else {
                type = "image";
              }
              urls = {
                "originalUrl": doc.url,
                "type": type
              }

              if (type == "doc") {
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
                function (new_Blob) {
                  urls['convertedUrl'] = new_Blob.url;
                  Meteor.call("uploadInvoice", tmpl.data.currentReceipt, urls, HospoHero.handleMethodResult());
                }
              );
            }
          });
        }
      });
  }
});