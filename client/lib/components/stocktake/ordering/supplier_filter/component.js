var component = FlowComponents.define("supplierFilter", function(props) {
});

component.state.suppliers = function() {
  var ordersList = StockOrders.find({"version": Session.get("thisVersion")}, {sort: {"supplier": 1}}).fetch();
  var supplierslist = [];
  var activeSupplier = null;
  if(ordersList) {
    ordersList.forEach(function(order) {
      var supplier = null;
      if(order.supplier) {
        supplier = order.supplier;
      } else {
        supplier = "Non-assigned";
      }
      if(supplierslist.indexOf(supplier) < 0) {
        supplierslist.push(supplier);
      }
    });

    if(supplierslist[0] == "Non-assigned") {
      activeSupplier = null;
    } else {
      activeSupplier = supplierslist[0];
    }
    if(!Session.get("activeSupplier")) {
      Session.set("activeSupplier", activeSupplier)
    }
    return supplierslist;
  }
}

component.state.activeSupplier = function() {
  var supplier = Session.get("activeSupplier");
  if(supplier) {
    return supplier;
  } else {
    return "Non-assigned";
  }
}

component.state.thisSupplierActive = function(id) {
  var active = Session.get("activeSupplier");
  if(active == id) {
    return true;
  } else if(active == null && id == "Non-assigned") {
    return true;
  } else {
    return false;
  }
}

component.state.receipt = function() {
  var receipt = OrderReceipts.findOne({
    "version": Session.get("thisVersion"),
    "supplier": Session.get("activeSupplier")
  });
  return receipt;
}

component.state.orderSentDetails = function() {
  var receipt = OrderReceipts.findOne({
    "version": Session.get("thisVersion"),
    "supplier": Session.get("activeSupplier")
  });
  var text = null;
  if(receipt) {
    if(receipt.orderedThrough.through == "emailed") {
      text = "Email sent ";
    } else if(receipt.orderedThrough.through == "phoned") {
      text = "Phoned ";
    }
    text += moment(receipt.date).format("MMMM Do YYYY, h:mm:ss a");
  }
  return text;
}

component.state.receiptExists = function(supplier) {
  var receipt = OrderReceipts.findOne({
    "version": Session.get("thisVersion"),
    "supplier": supplier
  });
  if(receipt) {
    return true;
  } else {
    return false;
  }
}
