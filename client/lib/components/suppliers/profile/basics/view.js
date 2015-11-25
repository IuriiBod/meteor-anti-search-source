Template.basics.onCreated(function () {
    var self = this;
    self.supplier = new ReactiveVar();

    FlowComponents.callAction('getThisSupplier').then(function (res) {
        self.supplier.set(res);
    });

    self.updateSupplierDetails = function (field, newValue) {
        if (newValue) {
            var doc = self.supplier.get();
            doc[field] = newValue;
            Meteor.call('editSupplier', doc, HospoHero.handleMethodResult());
        }
    };
});

Template.basics.onRendered(function () {
    defineEditableComponents(this);
});

Template.basics.events({
    'click #uploadPriceList': function (e) {
        e.preventDefault();
        FlowComponents.callAction('uploadPriceList').then(function(res){
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
        showbuttons: false,
        mode: 'inline',
        autotext: 'auto',
        display: function () {
        },
        success: function (response, newValue) {
            tmpl.updateSupplierDetails('email', newValue);
        }
    });

    tmpl.$('.supplier-phone').editable({
        type: 'text',
        title: 'Edit phone number',
        showbuttons: false,
        mode: 'inline',
        autotext: 'auto',
        display: function () {
        },
        success: function (response, newValue) {
            tmpl.updateSupplierDetails('phone', newValue);
        }
    });

    tmpl.$('.minimum-order-amount').editable({
        type: 'text',
        title: 'Minimum order amount',
        showbuttons: false,
        mode: 'inline',
        autotext: 'auto',
        display: function () {
        },
        success: function (response, newValue) {
            tmpl.updateSupplierDetails('minimumOrderAmount', newValue);
        }
    });

    tmpl.$('.contact-name').editable({
        type: 'text',
        title: 'Minimum order amount',
        showbuttons: false,
        mode: 'inline',
        autotext: 'auto',
        display: function () {
        },
        success: function (response, newValue) {
            tmpl.updateSupplierDetails('contactName', newValue);
        }
    });

    tmpl.$('.customer-number').editable({
        type: 'text',
        title: 'Minimum order amount',
        showbuttons: false,
        mode: 'inline',
        autotext: 'auto',
        display: function () {
        },
        success: function (response, newValue) {
            tmpl.updateSupplierDetails('customerNumber', newValue);
        }
    });
};