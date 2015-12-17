Template.newSupplier.onCreated(function () {
  this.closeModal = function (modalId) {
    $(modalId).modal("hide");
    $('.modal-backdrop').remove();
  };

  this.set('deliveryTime', new Date());
});

Template.newSupplier.helpers({
  timepickerParams: function () {
    var tmpl = Template.instance();

    return {
      firstTime: tmpl.get('deliveryTime'),
      minuteStepping: 5,
      onSubmit: function (startTime) {
        tmpl.set('deliveryTime', startTime);
      }
    };
  }
});

Template.newSupplier.events({
  'submit form': function (e, tmpl) {
    e.preventDefault();
    var fields = [
      'name',
      'email',
      'phone',
      {
        name: 'minimumOrderAmount',
        parse: 'int'
      },
      'contactName',
      'customerNumber'
    ];
    var values = HospoHero.misc.getValuesFromEvent(e, fields, true);
    values.deliveryTime = tmpl.get('deliveryTime');

    var deliveryDayCheckboxes = tmpl.$(e.target).find('[name="deliveryDay"]');
    deliveryDayCheckboxes = _.map(deliveryDayCheckboxes, function (checkbox) {
      return checkbox.checked ? checkbox.value : false;
    });
    values.deliveryDays = _.compact(deliveryDayCheckboxes);

    Meteor.call("createSupplier", values, HospoHero.handleMethodResult(function (supplierId) {
      tmpl.closeModal("#addNewSupplierModal");
      Router.go("supplierProfile", {"_id": supplierId});
    }));
  }
});