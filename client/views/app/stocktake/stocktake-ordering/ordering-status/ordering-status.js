Template.orderingStatus.onCreated(function () {
  this.getCurrentReceipt = function () {
    return OrderReceipts.findOne({
      version: this.data.stocktakeMainId,
      supplier: this.data.activeSupplierId,
      'orderedThrough.through': {$ne: null}
    });
  };

  this.getDeliveryDate = function () {
    var receipt = this.getCurrentReceipt();
    return receipt && receipt.expectedDeliveryDate && new Date(receipt.expectedDeliveryDate);
  };
});

Template.orderingStatus.onRendered(function () {
  this.generateReceipts = function (orderType) {
    var supplierId = this.data.activeSupplierId;
    if (orderType === 'emailed') {
      ModalManager.open('composeStocktakeOrderingEmail', {
        stocktakeMainId: this.data.stocktakeMainId,
        supplier: Suppliers.findOne({_id: supplierId})
      });
    } else {
      var info = {
        through: orderType,
        details: null,
        expectedDeliveryDate: moment().add(1, 'days').toDate()
      };
      Meteor.call('generateReceipts', this.data.stocktakeMainId, supplierId, info, HospoHero.handleMethodResult());
    }
  };
});


Template.orderingStatus.helpers({
  receipt: function () {
    return Template.instance().getCurrentReceipt();
  },

  deliveryDate: function () {
    return Template.instance().getDeliveryDate();
  },

  orderSentDetails: function (receipt) {
    return receipt && receipt.orderedThrough.through === "emailed" && "Email sent " || "Phoned " +
      moment(receipt.date).format("MMMM Do YYYY, h:mm:ss a");
  }
});


Template.orderingStatus.events({
  'click .order-emailed-button': function (event, tmpl) {
    event.preventDefault();
    tmpl.generateReceipts('emailed');
  },

  'click .order-phoned-button': function (event, tmpl) {
    event.preventDefault();
    tmpl.generateReceipts('phoned');
  }
});


