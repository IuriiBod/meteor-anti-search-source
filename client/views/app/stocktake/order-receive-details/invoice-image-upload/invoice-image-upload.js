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

      let updatedOrder = this._addInvoiceImageToOrder(invoiceImage);
      Meteor.call('updateOrder', updatedOrder, HospoHero.handleMethodResult());
    });
  }

  _addInvoiceImageToOrder(invoiceImage) {
    if (!_.isArray(this._order.invoiceImages)) {
      this._order.invoiceImages = [];
    }
    this._order.invoiceImages.push(invoiceImage);
    return this._order;
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

Template.invoiceImageUpload.events({
  'click .upload-invoice-button': function (event, tmpl) {
    event.preventDefault();
    let invoiceUploader = new InvoiceUploader(tmpl.data);
    invoiceUploader.upload();
  }
});