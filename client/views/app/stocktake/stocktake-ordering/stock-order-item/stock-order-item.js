//context: StockOrder
Template.stockOrderItem.onRendered(function () {
  var tmpl = this;
  var onCountChanged = function (response, newValue) {
    if (newValue) {
      var count = parseFloat(newValue) || 0;
      Meteor.call('editOrderingCount', tmpl.data._id, count, HospoHero.handleMethodResult(function () {
      }));
    }
  };

  this.$('.ordering-count').editable({
    title: 'Edit count',
    showbuttons: false,
    mode: 'inline',
    autotext: 'auto',
    success: onCountChanged
  });
});


Template.stockOrderItem.helpers({
  orderStockName: function () {
    var stock = Ingredients.findOne({_id: this.stockId});
    return stock && stock.description || this.stockName;
  },

  isEditable: function () {
    return !this.orderReceipt;
  }
});


Template.stockOrderItem.events({
  'click .remove-stock-order-button': function (event, tmpl) {
    event.preventDefault();
    var confirmDelete = confirm("Are you sure you want to delete this order?");
    if (confirmDelete) {
      Meteor.call("removeOrder", tmpl.data._id, HospoHero.handleMethodResult());
    }
  }
});
