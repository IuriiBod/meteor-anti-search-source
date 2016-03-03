Template.basics.onRendered(function () {
  defineEditableComponents(this);
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
        return 'Only email!';
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