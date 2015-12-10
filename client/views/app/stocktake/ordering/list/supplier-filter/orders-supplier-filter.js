Template.supplierFilter.onRendered(function () {
  var self = this;
  this.generateReceipts = function (orderType) {
    var supplier = this.get('activeSupplier');
    var version = HospoHero.getParamsFromRoute(Router.current(), '_id');
    var address = null;
    var deliveryDate = moment().add(1, 'days').format('x');
    var info = {
      "through": orderType,
      "details": address,
      "deliveryDate": deliveryDate
    };
    if (orderType == "emailed") {
      $("#composeMailModal").modal();
    } else {
      Meteor.call("generateReceipts", version, supplier, info, HospoHero.handleMethodResult());
    }
  };

  $(".expectedDeliveryDate").datepicker({
      'todayHighlight': true,
      'weekStart': 1
    }).on("changeDate", function (event) {
      var supplier = self.get("activeSupplier");
      var version = self.data.orderId;
      var date = event.date;
      date = moment(date).format("YYYY-MM-DD");
      var id = null;
      var receipt = OrderReceipts.findOne({"supplier": supplier, "version": version});
      var info = {
        "expectedDeliveryDate": new Date(date).getTime(),
        "version": version,
        "supplier": supplier
      };
      if (receipt) {
        id = receipt._id;
      }
      Meteor.call("updateReceipt", id, info, HospoHero.handleMethodResult());
    });
});

Template.supplierFilter.helpers({
  suppliers: function() {
    var ordersList = StockOrders.find({
      version: this.orderId
    }, {
      fields: {
        supplier: 1
      },
      sort: {
        supplier: 1
      }
    }).fetch();

    var suppliersList = _.groupBy(ordersList, 'supplier');
    suppliersList = _.keys(suppliersList);

    if (!Template.instance().get('activeSupplier')) {
      Template.instance().set('activeSupplier', suppliersList[0]);
      this.onSupplierChanged(suppliersList[0]);
    }

    return suppliersList;
  },

  receipt: function() {
    return OrderReceipts.findOne({
      "version": this.orderId,
      "supplier": Template.instance().get("activeSupplier"),
      "orderedThrough": {$ne: null}
    });
  },

  deliveryDate: function() {
    var receipt = OrderReceipts.findOne({
      "version": this.orderId,
      "supplier": Template.instance().get("activeSupplier")
    });
    if (receipt && receipt.expectedDeliveryDate) {
      return parseInt(receipt.expectedDeliveryDate);
    } else {
      return moment().add(1, 'day');
    }
  },

  orderSentDetails: function() {
    var receipt = OrderReceipts.findOne({
      "version": this.orderId,
      "supplier": Template.instance().get("activeSupplier"),
      "orderedThrough": {$ne: null}
    });
    var text = null;
    if (receipt) {
      if (receipt.orderedThrough && receipt.orderedThrough.through == "emailed") {
        text = "Email sent ";
      } else if (receipt.orderedThrough && receipt.orderedThrough.through == "phoned") {
        text = "Phoned ";
      }
      text += moment(receipt.date).format("MMMM Do YYYY, h:mm:ss a");
    }
    return text;
  },

  receiptExists: function(supplier) {
    var receipt = OrderReceipts.findOne({
      "version": Template.instance().data.orderId,
      "supplier": supplier,
      "orderedThrough": {$ne: null}
    });
    return !!(receipt && receipt.orderedThrough && receipt.orderedThrough.through);
  }
});

Template.supplierFilter.events({
  'click .activateSupplier': function (event, tmpl) {
    event.preventDefault();
    var supplierId = this.toString();
    tmpl.set('activeSupplier', supplierId);
    tmpl.data.onSupplierChanged(supplierId);
  },

  'click .orderEmailed': function (event, tmpl) {
    event.preventDefault();
    tmpl.generateReceipts('emailed');
  },

  'click .orderPhoned': function (event, tmpl) {
    event.preventDefault();
    tmpl.generateReceipts('phoned');
  }
});