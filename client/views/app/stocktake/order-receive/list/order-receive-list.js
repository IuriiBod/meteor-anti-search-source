Template.orderReceive.onCreated(function () {
  this.currentOrderId = new ReactiveVar(null);
});

Template.orderReceive.helpers({
  list() {
    return StockOrders.find({orderReceipt: this.currentReceipt._id, countOrdered: {$gt: 0}});
  },

  total() {
    let orders = StockOrders.find({orderReceipt: this.currentReceipt._id});
    let cost = 0;
    if (orders.count()) {
      orders.forEach(function (order) {
        var count = order.countDelivered;
        if (!_.isFinite(count) || count < 0) {
          count = order.countOrdered;
        }
        cost += parseInt(count) * parseFloat(order.unitPrice);
      });
    }
    return cost;
  },

  receipt() {
    return this.currentReceipt;
  },

  isReceived() {
    return this.currentReceipt.received;
  },

  receivedNote() {
    return this.currentReceipt.receiveNote;
  },

  currentOrderCallback() {
    let instance = Template.instance();
    return function (orderId) {
      instance.currentOrderId.set(orderId);
    }
  },

  currentOrder() {
    let orderId = Template.instance().currentOrderId.get();
    return StockOrders.findOne({_id: orderId});
  }
});

Template.orderReceive.events({
  'click .markDeliveryReceived': function (event, tmpl) {
    event.preventDefault();
    let receiptId = tmpl.data.currentReceipt._id;
    Meteor.call("receiveDelivery", receiptId, HospoHero.handleMethodResult());
  },

  'keyup #orderReceiveNotes': function (event, tmpl) {
    event.preventDefault();
    if (event.keyCode == 13) {
      let receiptId = tmpl.data.currentReceipt._id;
      let text = event.target.value;
      let info = {
        receiveNote: text.trim()
      };
      Meteor.call("updateReceipt", receiptId, info, HospoHero.handleMethodResult());
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
                  var receiptId = tmpl.data.currentReceipt._id;
                  urls['convertedUrl'] = new_Blob.url;
                  Meteor.call("uploadInvoice", receiptId, urls, HospoHero.handleMethodResult());
                }
              );
            }
          });
        }
      });
  }
});