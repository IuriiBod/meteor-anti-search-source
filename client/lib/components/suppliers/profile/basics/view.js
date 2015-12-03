Template.basics.onCreated(function () {
    var self = this;
    self.supplier = new ReactiveVar();

    self.updateSupplierDetails = function (field, newValue) {
        if (newValue) {
            var doc = self.supplier.get();
            doc[field] = newValue;
            Meteor.call('editSupplier', doc, HospoHero.handleMethodResult());
        }
    };
});

Template.basics.onRendered(function () {
    var self = this;
    FlowComponents.callAction('getThisSupplier').then(function (res) {
        self.supplier.set(res);
        defineEditableComponents(self);
    });
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
    }
});


var defineEditableComponents = function (tmpl) {

    tmpl.$('.supplier-email').editable({
        type: 'text',
        title: 'Edit supplier email',
        display: function () {
        },
        success: function (response, newValue) {
            tmpl.updateSupplierDetails('email', newValue);
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
            tmpl.updateSupplierDetails('phone', newValue);
        },
        validate: function (value) {
            if (!/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/.test(value)) {
                return 'Only phone number!'
            }
        }
    });

    tmpl.$('.minimum-order-amount').editable({
        type: 'text',
        title: 'Minimum order amount',
        display: function () {
        },
        success: function (response, newValue) {
            newValue = parseInt(newValue);
            tmpl.updateSupplierDetails('minimumOrderAmount', newValue);
        },
        validate: function (value) {
            if (!/\d+/.test(value)) {
                return 'Only number!';
            }
        }
    });

    tmpl.$('.delivery-day').editable({
        success: function (response, newValue) {
            tmpl.updateSupplierDetails('deliveryDay', newValue);
        },
        value: tmpl.supplier.get().deliveryDay,
        source: [
            {value: 'sunday', text: 'Sunday'},
            {value: 'monday', text: 'Monday'},
            {value: 'tuesday', text: 'Tuesday'},
            {value: 'wednesday', text: 'Wednesday'},
            {value: 'thursday', text: 'Thursday'},
            {value: 'friday', text: 'Friday'},
            {value: 'saturday', text: 'Saturday'}
        ]
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
            tmpl.updateSupplierDetails('deliveryTime', newValue);
        }
    });

    tmpl.$('.contact-name').editable({
        type: 'text',
        title: 'Minimum order amount',
        display: function () {
        },
        success: function (response, newValue) {
            tmpl.updateSupplierDetails('contactName', newValue);
        }
    });

    tmpl.$('.customer-number').editable({
        type: 'text',
        title: 'Minimum order amount',
        display: function () {
        },
        success: function (response, newValue) {
            tmpl.updateSupplierDetails('customerNumber', newValue);
        },
        validate: function (value) {
            if (!/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/.test(value)) {
                return 'Only phone number!'
            }
        }
    });
};