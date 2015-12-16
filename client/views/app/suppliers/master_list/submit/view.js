Template.newSupplier.onCreated(function () {
  this.closeModal = function (modalId) {
    $(modalId).modal("hide");
    $('.modal-backdrop').remove();
  };

  this.getValuesFromForm = function ($form) {
    var name = $form.find('.supplier-name').val();
    var email = $form.find('.email').val();
    var phone = $form.find('.phone-number').val();
    var minimumOrderAmount = $form.find('.minimum-order-amount').val();
    var deliveryTime = $form.find('.delivery-time').data('DateTimePicker').date().toDate();
    var contactName = $form.find('.contact-name').val();
    var customerNumber = $form.find('.customer-number').val();

    minimumOrderAmount = parseInt(minimumOrderAmount);

    var deliveryDayCheckboxes = $form.find('[name="deliveryDay"]');
    deliveryDayCheckboxes = _.map(deliveryDayCheckboxes, function (checkbox) {
      return checkbox.checked ? checkbox.value : false;
    });
    var deliveryDays = _.compact(deliveryDayCheckboxes);

    return {
      name: name,
      email: email,
      phone: phone,
      minimumOrderAmount: minimumOrderAmount,
      deliveryDays: deliveryDays,
      deliveryTime: deliveryTime,
      contactName: contactName,
      customerNumber: customerNumber
    };
  };
});

Template.newSupplier.onRendered(function () {
  $('.delivery-time').datetimepicker({
    defaultDate: moment(),
    format: 'hh:mm',
    dayViewHeaderFormat: 'hh:mm',
    stepping: 10
  });
});

Template.newSupplier.events({
  'submit form': function (e, tmpl) {
    e.preventDefault();
    var $form = $(e.target);

    var doc = tmpl.getValuesFromForm($form);

    FlowComponents.callAction('createSupplier', doc);
    tmpl.closeModal("#addNewSupplierModal");
  }
});