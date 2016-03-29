Template.basics.onCreated(function () {
  this.supplier = function () {
    return Suppliers.findOne({_id: this.data.id});
  };

  this.updateSupplierDetails = function (field, value) {
    if (value) {
      var supplier = this.supplier();
      supplier[field] = value;
      Meteor.call('editSupplier', supplier, HospoHero.handleMethodResult());
    }
  };

  this.triggerUpdateSupplier = function (field, value) {
    $('.test-element').trigger('updateSupplier', [field, value]);
  };
});


Template.basics.helpers({
  supplier: function () {
    return Template.instance().supplier();
  },
  status: function () {
    var supplier = Template.instance().supplier();
    return supplier && supplier.active;
  },
  lastOrder: function () {
    return Orders.findOne({'supplier': this.id}, {sort: {'date': -1}});
  },
  deliveryDays: function () {
    return [
      {value: 'monday', text: 'Monday'},
      {value: 'tuesday', text: 'Tuesday'},
      {value: 'wednesday', text: 'Wednesday'},
      {value: 'thursday', text: 'Thursday'},
      {value: 'friday', text: 'Friday'},
      {value: 'saturday', text: 'Saturday'},
      {value: 'sunday', text: 'Sunday'}
    ];
  },
  isSelectedDay: function (value) {
    var supplier = Template.instance().supplier();
    return supplier && supplier.deliveryDays.indexOf(value) > -1;
  },
  convertToPdfUrl: function () {
    return '/convert?format=pdf';
  },
  timepickerParams: function () {
    var tmpl = Template.instance();

    return {
      firstTime: tmpl.supplier().deliveryTime,
      minuteStepping: 5,
      onSubmit: function (startTime) {
        tmpl.triggerUpdateSupplier('deliveryTime', startTime);
      }
    };
  }
});

Template.basics.events({
  'click #uploadPriceList': function (e, tmpl) {
    e.preventDefault();
    filepicker.pickMultiple({
      services: ['COMPUTER']
    }, function (blobs) {
      if (_.isArray(blobs)) {
        var urlArray = _.map(blobs, function (doc) {
          return {
            url: doc.url,
            name: doc.filename,
            uploadedAt: new Date()
          };
        });
        Meteor.call('addPriceList', tmpl.data.id, urlArray, HospoHero.handleMethodResult());
      }
    }, HospoHero.handleMethodResult(function () {
      $('.uploadedPriceList').removeClass('hide');
      //$('#uploadedImageUrl').attr('src', url);
    }));
  },

  'click .supplierStatus': function (e, tmpl) {
    e.preventDefault();
    Meteor.call('activateReactivateSuppliers', tmpl.data.id, HospoHero.handleMethodResult(function () {
      Router.go('suppliersList');
    }));
  },

  'click .delete-price-list': function (event, tmpl) {
    event.preventDefault();
    Meteor.call('removePriceList', tmpl.data.id, this, HospoHero.handleMethodResult());
  },

  'updateSupplier .test-element': function (event, tmpl, field, value) {
    if (field) {
      tmpl.updateSupplierDetails(field, value);
    }
  },

  'change .delivery-day': function (event, tmpl) {
    var supplier = tmpl.supplier();

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