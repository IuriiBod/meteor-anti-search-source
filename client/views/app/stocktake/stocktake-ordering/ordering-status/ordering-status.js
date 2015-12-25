Template.orderingStatus.onRendered(function () {
  this.$('.expectedDeliveryDate').datepicker({
    todayHighlight: true,
    weekStart: 1
  });

  this.generateReceipts = function (orderType) {
    var supplierId = this.data.activeSupplierId;
    if (orderType == 'emailed') {
      console.log('generate: ', orderType);
      ModalManager.open('composeStocktakeOrderingEmail', {
        stocktakeMainId: this.data.stocktakeMainId,
        supplier: Suppliers.findOne({_id: supplierId})
      });
    } else {
      var info = {
        through: orderType,
        details: null,
        deliveryDate: moment().add(1, 'days').format('x')
      };
      Meteor.call('generateReceipts', this.data.stocktakeMainId, supplierId, info, HospoHero.handleMethodResult());
    }
  };
});


Template.orderingStatus.helpers({
  receipt: function () {
    return OrderReceipts.findOne({
      version: this.stocktakeMainId,
      supplier: this.activeSupplierId,
      'orderedThrough.through': {$ne: null}
    });
  },

  deliveryDate: function (receipt) {
    return receipt && receipt.expectedDeliveryDate || moment().add(1, 'day');
  },

  orderSentDetails: function (receipt) {
    return receipt && receipt.orderedThrough.through == "emailed" && "Email sent " || "Phoned " +
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
  },

  'changeDate .expected-delivery-date-picker': function (event, tmpl) {
    var supplierId = tmpl.data.activeSupplierId;
    var version = tmpl.data.stocktakeMainId;
    var receipt = OrderReceipts.findOne({supplier: supplierId, version: version});
    var info = {
      expectedDeliveryDate: moment(event.date).startOf('day').getTime(),
      version: version,
      supplier: supplierId
    };
    Meteor.call("updateReceipt", receipt._id, info, HospoHero.handleMethodResult());
  }
});


