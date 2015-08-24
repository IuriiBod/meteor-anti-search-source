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

component.prototype.onSupplierRendered = function() {
  $("#supplierEmail").editable({
    type: 'text',
    title: 'Edit Email Address',
    showbuttons: true,
    mode: 'inline',
    emptytext: 'Empty',
    display: false,
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
    showbuttons: true,
    mode: 'inline',
    emptytext: 'Empty',
    success: function(response, newValue) {
      var self = this;
      if(newValue) {
        var id = Session.get("thisSupplier");
        var editDetail = {"phone": newValue};
        updateSupplierDetails(id, editDetail);
      }
    },
    display: function(value, sourceData) {
    }
  });
}

function updateSupplierDetails(id, info) {
  Meteor.call("updateSupplier", id, info, function(err) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    }
  });
}