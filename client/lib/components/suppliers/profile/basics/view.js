Template.basics.onCreated(function () {
  this.updateSupplierDetails = function (field, value) {
    if (value) {
      FlowComponents.callAction('updateSupplier', field, value);
    }
  };

  this.triggerUpdateSupplier = function (field, value) {
    this.data.field = field;
    this.data.value = value;
    $('.test-element').trigger('click');
  }
});

Template.basics.onRendered(function () {
  defineEditableComponents(this);
});

Template.basics.helpers({
  convertToPdfUrl: function () {
    return '/convert?format=pdf';
  }
});

Template.basics.events({
  'click #uploadPriceList': function (e) {
    e.preventDefault();
    FlowComponents.callAction('uploadPriceList').then(function (res) {
      if (res) {
        $('.uploadedPriceList').removeClass('hide');
        $('#uploadedImageUrl').attr('src', url);
      }
    });
  },

  'click .supplierStatus': function (e) {
    e.preventDefault();
    FlowComponents.callAction('changeSupplierStatus');
  },

  'click .delete-price-list': function (event) {
    event.preventDefault();
    FlowComponents.callAction('removePriceList', this);
  },

  'click .test-element': function (event, tmpl) {
    if (tmpl.data.field) {
      tmpl.updateSupplierDetails(tmpl.data.field, tmpl.data.value);
    }
  },

  'change .delivery-day': function (event, tmpl) {
    var supplierId = HospoHero.getParamsFromRoute(Router.current(), '_id');
    var supplier = Suppliers.findOne({_id: supplierId});

    var checkbox = event.target;
    if (checkbox.checked) {
      supplier.deliveryDays.push(checkbox.value);
    } else {
      var valueIndex = supplier.deliveryDays.indexOf(checkbox.value);
      supplier.deliveryDays.splice(valueIndex, 1);
    }
    tmpl.updateSupplierDetails('deliveryDays', supplier.deliveryDays);
  }
});


var defineEditableComponents = function (tmpl) {

  tmpl.$('.supplier-email').editable({
    type: 'text',
    title: 'Edit supplier email',
    display: false,
    success: function (response, newValue) {
      tmpl.triggerUpdateSupplier('email', newValue);
    },
    validate: function (value) {
      if (!/.+@(.+){2,}\.(.+){2,}/.test(value)) {
        return 'Only email!'
      }
    }
  });

  tmpl.$('.supplier-phone').editable({
    type: 'text',
    title: 'Edit phone number',
    display: function () {
    },
    success: function (response, newValue) {
      tmpl.triggerUpdateSupplier('phone', newValue);
    }
  });

  tmpl.$('.minimum-order-amount').editable({
    type: 'text',
    title: 'Minimum order amount',
    display: function () {
    },
    success: function (response, newValue) {
      newValue = parseInt(newValue);
      tmpl.triggerUpdateSupplier('minimumOrderAmount', newValue);
    },
    validate: function (value) {
      if (!/\d+/.test(value)) {
        return 'Only number!';
      }
    }
  });

  tmpl.$('.delivery-time').editable({
    type: 'combodate',
    template: "h:mm A",
    viewformat: "h:mm A",
    display: false,
    showbuttons: true,
    inputclass: "editableTime",
    mode: 'inline',
    success: function (response, newValue) {
      newValue = newValue.toDate();
      tmpl.triggerUpdateSupplier('deliveryTime', newValue);
    }
  });

  tmpl.$('.contact-name').editable({
    type: 'text',
    title: 'Minimum order amount',
    display: function () {
    },
    success: function (response, newValue) {
      tmpl.triggerUpdateSupplier('contactName', newValue);
    }
  });

  tmpl.$('.customer-number').editable({
    type: 'text',
    title: 'Minimum order amount',
    display: function () {
    },
    success: function (response, newValue) {
      tmpl.triggerUpdateSupplier('customerNumber', newValue);
    }
  });
};