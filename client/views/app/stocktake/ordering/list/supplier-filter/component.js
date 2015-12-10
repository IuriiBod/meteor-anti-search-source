//var component = FlowComponents.define("supplierFilter", function (props) {
//  this.onRendered(this.onListRendered);
//  this.onSupplierChanged = props.onSupplierChanged;
//  this.version = HospoHero.getParamsFromRoute(Router.current(), '_id');
//});

//component.state.suppliers = function () {
//  var ordersList = StockOrders.find({
//    version: Router.current().params._id
//  }, {
//    fields: {
//      supplier: 1
//    },
//    sort: {
//      supplier: 1
//    }
//  }).fetch();
//
//  var suppliersList = _.groupBy(ordersList, 'supplier');
//  suppliersList = _.keys(suppliersList);
//
//  if (!this.get('activeSupplier')) {
//    this.set('activeSupplier', suppliersList[0]);
//    this.onSupplierChanged(suppliersList[0]);
//  }
//
//  return suppliersList;
//};

//component.state.receipt = function () {
//  return OrderReceipts.findOne({
//    "version": this.version,
//    "supplier": this.get("activeSupplier"),
//    "orderedThrough": {$ne: null}
//  });
//};

//component.state.deliveryDate = function () {
//  var receipt = OrderReceipts.findOne({
//    "version": this.version,
//    "supplier": this.get("activeSupplier")
//  });
//  if (receipt && receipt.expectedDeliveryDate) {
//    return parseInt(receipt.expectedDeliveryDate);
//  } else {
//    return moment().add(1, 'day');
//  }
//};

//component.state.orderSentDetails = function () {
//  var receipt = OrderReceipts.findOne({
//    "version": this.version,
//    "supplier": this.get("activeSupplier"),
//    "orderedThrough": {$ne: null}
//  });
//  var text = null;
//  if (receipt) {
//    if (receipt.orderedThrough && receipt.orderedThrough.through == "emailed") {
//      text = "Email sent ";
//    } else if (receipt.orderedThrough && receipt.orderedThrough.through == "phoned") {
//      text = "Phoned ";
//    }
//    text += moment(receipt.date).format("MMMM Do YYYY, h:mm:ss a");
//  }
//  return text;
//};

//component.state.receiptExists = function (supplier) {
//  var receipt = OrderReceipts.findOne({
//    "version": this.version,
//    "supplier": supplier,
//    "orderedThrough": {$ne: null}
//  });
//  return !!(receipt && receipt.orderedThrough && receipt.orderedThrough.through);
//};


//component.action.getSupplier = function () {
//  return this.get('activeSupplier');
//};


//component.action.setActiveSupplier = function (supplierId) {
//  this.set('activeSupplier', supplierId);
//  this.onSupplierChanged(supplierId);
//};