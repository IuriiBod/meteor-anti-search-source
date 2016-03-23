Template.orderReceive.onCreated(function () {
  this.currentOrderId = new ReactiveVar(null);
});

Template.orderReceive.helpers({
  list() {
    return OrderItems.find({orderReceipt: this.currentReceipt._id, countOrdered: {$gt: 0}});
  },

  total() {
    let orders = OrderItems.find({orderReceipt: this.currentReceipt._id});
    let cost = 0;
    if (orders.count()) {
      orders.forEach(function (order) {
        var count = order.countDelivered;
        if (!_.isFinite(count) || count < 0) {
          count = order.countOrdered;
        }
        cost += parseFloat(count) * parseFloat(order.unitPrice);
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
    };
  },

  currentOrder() {
    let orderId = Template.instance().currentOrderId.get();
    return OrderItems.findOne({_id: orderId});
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
    if (event.keyCode === 13) {
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

    let getDocumentTypeByMimetype = (mimetype) => {
      let type = false;
      switch (mimetype) {
        case "application/pdf":
          type = "pdf";
          break;

        case "text/csv":
          type = "csv";
          break;

        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          type = "doc";
          break;

        case "application/msword":
          type = "doc";
          break;

        default:
          type = "image";
      }

      return type;
    };

    let createDocumentPreview = function (invoiceImage) {
      let blob = {
        url: invoiceImage.originalUrl,
        mimetype: 'image/png',
        isWriteable: false,
        size: 28683
      };

      filepicker.convert(
        blob, {
          width: 200,
          height: 200,
          format: 'png',
          compress: true,
          quality: 100
        }, function (newBlob) {
          invoiceImage.convertedUrl = newBlob.url;

          //todo:stocktake needs to be checked
          let order = tmpl.data.currentReceipt;
          order.invoiceImage = invoiceImage;
          Meteor.call('updateOrder', order, HospoHero.handleMethodResult());
        });
    };

    let handleUploadedDocument = function (document) {
      if (!document) {
        return;
      }

      var type = getDocumentTypeByMimetype(document.mimetype);

      let invoiceImage = {
        originalUrl: `${document.url}${(type === 'doc' ? '/convert?format=pdf' : '')}`,
        type: type
      };

      createDocumentPreview(invoiceImage);
    };

    filepicker.pickAndStore({
      extensions: ['.jpg', '.jpeg', '.png', '.doc', '.docx', '.pdf', '.xls', '.csv'],
      services: ['COMPUTER'],
      multiple: true
    }, {}, function (InkBlobs) {
      if (InkBlobs && InkBlobs.length > 0) {
        InkBlobs.forEach(handleUploadedDocument);
      }
    });
  }
});