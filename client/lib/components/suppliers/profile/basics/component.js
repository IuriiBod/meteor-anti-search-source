var component = FlowComponents.define("basics", function(props) {
  this.onRendered(this.onSupplierRendered);
});

component.state.basics = function() {
  var id = Session.get("thisSupplier");
  if(id) {
    var supplier = Suppliers.findOne(id);
    if(supplier) {
      return supplier;
    }
  }
}

component.state.status = function() {
  var id = Session.get("thisSupplier");
  if(id) {
    var supplier = Suppliers.findOne(id);
    if(supplier) {
      if(supplier.active) {
        return true;
      }
    } 
  }
}

component.state.lastOrder = function() {
  var orders = OrderReceipts.find({"supplier": Session.get("thisSupplier")}, {sort: {"date": -1}, limit: 1}).fetch();
  if(orders && orders.length > 0) {
    if(orders[0].date) {
      return orders[0].date;
    }
  }
}

component.prototype.onSupplierRendered = function() {
  $("#supplierEmail").editable({
    type: "text",
    title: 'Edit supplier email',
    showbuttons: false,
    mode: 'inline',
    autotext: 'auto',
    display: function(value, response) {
    },
    success: function(response, newValue) {
      var self = this;
      if(newValue) {
        var id = Session.get("thisSupplier");
        var editDetail = {"email": newValue};
        updateSupplierDetails(id, editDetail);
      }
    },
    display: function(value, sourceData) {
    }
  });

  $("#supplierPhone").editable({
    type: 'text',
    title: 'Edit phone number',
    showbuttons: false,
    mode: 'inline',
    autotext: 'auto',
    display: function(value, response) {
    },
    success: function(response, newValue) {
      var self = this;
      if(newValue) {
        var id = Session.get("thisSupplier");
        var editDetail = {"phone": newValue};
        updateSupplierDetails(id, editDetail);
      }
    }
  });
}

function updateSupplierDetails(id, info) {
  Meteor.call("updateSupplier", id, info, function(err) {
    if(err) {
      HospoHero.error(err);
    }
  });
}