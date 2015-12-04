var component = FlowComponents.define("supplierFilter", function(props) {
  this.onRendered(this.onListRendered);
  this.onSupplierChanged = props.onSupplierChanged;
  this.version = HospoHero.getParamsFromRoute(Router.current(), '_id');
});

component.state.suppliers = function() {
  var ordersList = StockOrders.find({
    version: Router.current().params._id
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

  this.set('activeSupplier', suppliersList[0]);
  this.onSupplierChanged(suppliersList[0]);

  return suppliersList;
};

component.state.receipt = function() {
  return OrderReceipts.findOne({
    "version": this.version,
    "supplier": this.get("activeSupplier"),
    "orderedThrough": {$ne: null}
  });
};

component.state.deliveryDate = function() {
  var receipt = OrderReceipts.findOne({
    "version": this.version,
    "supplier": this.get("activeSupplier")
  });
  if(receipt && receipt.expectedDeliveryDate) {
    return receipt.expectedDeliveryDate;
  } else {
    return moment().add(1, 'day');
  }
};

component.state.orderSentDetails = function() {
  var receipt = OrderReceipts.findOne({
    "version": this.version,
    "supplier": this.get("activeSupplier"),
    "orderedThrough": {$ne: null}
  });
  var text = null;
  if(receipt) {
    if(receipt.orderedThrough && receipt.orderedThrough.through == "emailed") {
      text = "Email sent ";
    } else if(receipt.orderedThrough && receipt.orderedThrough.through == "phoned") {
      text = "Phoned ";
    }
    text += moment(receipt.date).format("MMMM Do YYYY, h:mm:ss a");
  }
  return text;
};

component.state.receiptExists = function(supplier) {
  var receipt = OrderReceipts.findOne({
    "version": this.version,
    "supplier": supplier,
    "orderedThrough": {$ne: null}
  });
  return !!(receipt && receipt.orderedThrough && receipt.orderedThrough.through);
};

component.prototype.onListRendered = function() {
  $(".expectedDeliveryDate")
  .datepicker({
    'todayHighlight': true,
    'weekStart': 1
  })
  .on("changeDate", function(event) {
    var supplier = this.get("activeSupplier");
    var version = this.version;
    var date = event.date;
    date = moment(date).format("YYYY-MM-DD");
    var id = null;
    var receipt = OrderReceipts.findOne({"supplier": supplier, "version": version});
    var info = {
      "expectedDeliveryDate": new Date(date).getTime(),
      "version": version,
      "supplier": supplier
    };
    if(receipt) {
      id = receipt._id;
    }
    Meteor.call("updateReceipt", id, info, HospoHero.handleMethodResult());
  });
};


component.action.setActiveSupplier = function (supplierId) {
  this.set('activeSupplier', supplierId);
  this.onSupplierChanged(supplierId);
};