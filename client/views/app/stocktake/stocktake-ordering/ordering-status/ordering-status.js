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
    return receipt && receipt.expectedDeliveryDate && new Date(receipt.expectedDeliveryDate) || moment().add(1, 'day');
  };
});

Template.orderingStatus.onRendered(function () {
  //initialize date picker
  var datePickerElement = this.$(".date-picker-input");
  datePickerElement.datetimepicker({
    calendarWeeks: true,
    format: 'YYYY-MM-DD'
  });
  this.datePicker = datePickerElement.data("DateTimePicker");
  this.datePicker.date(moment(this.getDeliveryDate()));

  this.generateReceipts = function (orderType) {
    var supplierId = this.data.activeSupplierId;
    if (orderType == 'emailed') {
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
    return Template.instance().getCurrentReceipt()
  },

  deliveryDate: function () {
    return Template.instance().getDeliveryDate();
  },

  orderSentDetails: function (receipt) {
    return receipt && receipt.orderedThrough.through == "emailed" && "Email sent " || "Phoned " +
      moment(receipt.date).format("MMMM Do YYYY, h:mm:ss a");
  }
});


Template.orderingStatus.events({
  'click .date-picker-button': function (event, tmpl) {
    tmpl.datePicker.toggle();
  },

  'click .order-emailed-button': function (event, tmpl) {
    event.preventDefault();
    tmpl.generateReceipts('emailed');
  },

  'click .order-phoned-button': function (event, tmpl) {
    event.preventDefault();
    tmpl.generateReceipts('phoned');
  },

  'dp.change .date-picker-input': function (event, tmpl) {
    var date = tmpl.datePicker.date().toDate();

    var supplierId = tmpl.data.activeSupplierId;
    var version = tmpl.data.stocktakeMainId;
    var receipt = OrderReceipts.findOne({supplier: supplierId, version: version});

    if (!moment(date).isSame(receipt.expectedDeliveryDate, 'day')) {
      var info = {
        expectedDeliveryDate: moment(date).startOf('day').valueOf(),
        version: version,
        supplier: supplierId
      };
      Meteor.call("updateReceipt", receipt._id, info, HospoHero.handleMethodResult());
    }
  }
});


