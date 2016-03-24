Template.wrongQuantityModal.onRendered(function () {
  this.$('[data-toggle="popover"]').popover();
  this.$('.i-checks').iCheck({
    checkboxClass: 'icheckbox_square-green'
  });
});

Template.wrongQuantityModal.helpers({
});

Template.wrongQuantityModal.events({
  'submit .quantity-form': function (event, tmpl) {
    event.preventDefault();
    var $form =tmpl.$(event.target);
    var $invoiceQuantityInput = $form.find('.invoice-quantity-input');

    var invoiceQuantity = $invoiceQuantityInput.val();

    var receipt = tmpl.data.receipt;
    var order = tmpl.data.order;
    var info = {
      'quantity': Math.round(parseFloat(invoiceQuantity) * 100) / 100
    };

    if (invoiceQuantity && order._id && receipt._id) {
      Meteor.call('updateOrderItems', order._id, receipt._id, 'Wrong Quantity', info, HospoHero.handleMethodResult());
    }

    $invoiceQuantityInput.val('');
    $('#wrongQuantityModal').modal('hide');
  }
});