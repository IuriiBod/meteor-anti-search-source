var component = FlowComponents.define("supplierFilter", function(props) {
  this.onRendered(this.onListRendered);
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
    if(supplierslist && supplierslist.length > 0) {
      subs.subscribe("suppliers", supplierslist);
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

component.state.receipt = function() {
  var receipt = OrderReceipts.findOne({
    "version": Session.get("thisVersion"),
    "supplier": Session.get("activeSupplier"),
    "orderedThrough": {$ne: null}
  });
  return receipt;
}

component.state.deliveryDate = function() {
  var receipt = OrderReceipts.findOne({
    "version": Session.get("thisVersion"),
    "supplier": Session.get("activeSupplier")
  });
  if(receipt && receipt.expectedDeliveryDate) {
    return receipt.expectedDeliveryDate;
  } else {
    var date = moment().add(1, 'day');
    return date;
  }
}

component.state.orderSentDetails = function() {
  var receipt = OrderReceipts.findOne({
    "version": Session.get("thisVersion"),
    "supplier": Session.get("activeSupplier"),
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
}

component.state.receiptExists = function(supplier) {
  var receipt = OrderReceipts.findOne({
    "version": Session.get("thisVersion"),
    "supplier": supplier,
    "orderedThrough": {$ne: null}
  });
  if(receipt && receipt.orderedThrough && receipt.orderedThrough.through) {
    return true;
  } else {
    return false;
  }
}

component.prototype.onListRendered = function() {
  $(".expectedDeliveryDate").datepicker({
    'todayBtn': true,
    'todayHighlight': true,
    'weekStart': 1
  });

  $(".expectedDeliveryDate").on("changeDate", function(event) {
    var supplier = Session.get("activeSupplier");
    var version = Session.get("thisVersion");
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
    Meteor.call("updateReceipt", id, info, function(err, id) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      } 
    });
      // $("#my_hidden_input").val(
      //     $("#datepicker").datepicker('getFormattedDate')
      //  )
  });
  // $(".expectedDeliveryDate").editable({
  //   type: 'combodate',
  //   format: 'YYYY-MM-DD',    
  //   viewformat: 'YYYY-MM-DD',    
  //   title: 'Select time',
  //   template: "YYYY-MM-DD",
  //   mode: 'inline',
  //   success: function(response, newValue) {
  //     var supplier = Session.get("activeSupplier");
  //     var version = Session.get("thisVersion");
  //     var date = newValue.format("YYYY-MM-DD");
  //     var id = null;
  //     var receipt = OrderReceipts.findOne({"supplier": supplier, "version": version});
  //     var info = {
  //       "expectedDeliveryDate": new Date(date).getTime(),
  //       "version": version,
  //       "supplier": supplier
  //     };
  //     if(receipt) {
  //       id = receipt._id;
  //     }
  //     Meteor.call("updateReceipt", id, info, function(err, id) {
  //       if(err) {
  //         console.log(err);
  //         return alert(err.reason);
  //       } 
  //     });
  //   }
  // });
}
