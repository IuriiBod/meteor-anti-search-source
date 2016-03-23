Template.receiveModal.onRendered(function () {
  this.$('[data-toggle="popover"]').popover();
  this.$('.i-checks').iCheck({
    checkboxClass: 'icheckbox_square-green'
  });
});

Template.receiveModal.helpers({
  isWrongPrice: function () {
    if (this.name === 'wrongPrice') {
      return true;
    }
  },

  isWrongQuantity: function () {
    if (this.name === 'wrongQuantity') {
      return true;
    }
  }
});

Template.receiveModal.events({
  'submit .price-form': function (event, tmpl) {
    event.preventDefault();
    var $form = tmpl.$(event.target);
    var $priceInput = $form.find('.price-input');

    var price = $priceInput.val();
    var doUpdate = $form.find('.update-stock-price-input')[0].checked;

    var receipt = tmpl.data.receipt;
    var order = tmpl.data.order;
    var info = {
      'price': parseFloat(price),
      'stockPriceUpdated': doUpdate
    };

    if (price && price > 0) {
      Meteor.call('updateOrderItems', order._id, receipt._id, 'Wrong Price', info, HospoHero.handleMethodResult());
    }

    var stockId = order ? order.stockId : null;
    if (doUpdate) {
      info = {
        'costPerPortion': parseFloat(price)
      };
      if (price && price > 0) {
        Meteor.call('editIngredient', stockId, info, HospoHero.handleMethodResult());
      }
    }

    $priceInput.val('');
    $('#wrongPriceModal').modal('hide');
  },

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