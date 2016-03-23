Template.orderReceiveDetails.onCreated(function () {
});

Template.orderReceiveDetails.helpers({
  title() {
    let title = 'Supplier Orders Receive';
    let order = this.order;
    if (order && order.supplier) {
      let supplier = Suppliers.findOne({_id: order.supplierId});
      if (supplier) {
        title += " - [" + supplier.name + "]";
      }
    }
    return title;
  },

  isReceived() {
    return this.currentReceipt.received;
  },

  currentOrderCallback() {
    let instance = Template.instance();
    return function (orderId) {
      instance.currentOrderId.set(orderId);
    };
  }
});

Template.orderReceiveDetails.events({
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
    let invoiceUploader = new InvoiceUploader();
    invoiceUploader.upload();
  }
});


class InvoiceUploader {
  constructor(order) {
    this._order = _.extend({}, order);
  }

  upload() {
    filepicker.pickAndStore({
      extensions: ['.jpg', '.jpeg', '.png', '.doc', '.docx', '.pdf', '.xls', '.csv'],
      services: ['COMPUTER'],
      multiple: true
    }, {}, (InkBlobs) => {
      if (InkBlobs && InkBlobs.length > 0) {
        InkBlobs.forEach((document) => this._handleUploadedDocument(document));
      }
    });
  }

  _handleUploadedDocument(document) {
    if (!document) {
      return;
    }

    let type = this._getDocumentTypeByMimetype(document.mimetype);

    let invoiceImage = {
      originalUrl: `${document.url}${(type === 'doc' ? '/convert?format=pdf' : '')}`,
      type: type
    };

    this._createDocumentPreview(invoiceImage);
  }

  _createDocumentPreview(invoiceImage) {
    let blob = {
      url: invoiceImage.originalUrl,
      mimetype: 'image/png',
      isWriteable: false,
      size: 28683
    };

    filepicker.convert(blob, {
      width: 200,
      height: 200,
      format: 'png',
      compress: true,
      quality: 100
    }, (newBlob) => {
      invoiceImage.convertedUrl = newBlob.url;

      this._order.invoiceImage = invoiceImage;
      Meteor.call('updateOrder', order, HospoHero.handleMethodResult());
    });
  }

  _getDocumentTypeByMimetype(mimetype) {
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
  }
}