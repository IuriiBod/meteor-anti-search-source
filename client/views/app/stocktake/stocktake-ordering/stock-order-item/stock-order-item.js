//context: StockOrder
Template.stockOrderItem.onRendered(function () {
  let tmpl = this;
  let onCountChanged = function (response, newValue) {
    console.log('count changed', newValue);
    if (newValue) {
      let count = parseFloat(newValue) || 0;
      if (_.isFinite(count) && count >= 0) {
        Meteor.call('editOrderingCount', tmpl.data._id, count, HospoHero.handleMethodResult());
      } else {
        HospoHero.error('Incorrect value!');
      }
    }
  };

  this.$('.ordering-count').editable({
    title: 'Edit count',
    showbuttons: false,
    mode: 'inline',
    autotext: 'auto',
    display: () => {
    },
    success: onCountChanged
  });
});


Template.stockOrderItem.helpers({
  ingredient: function () {
    return Ingredients.findOne({_id: this.ingredient.id});
  },

  countNeeded: function () {
    //todo: this value should be calculated
    //(see details https://trello.com/c/6Xq3fCYy/299-10-link-up-needed-value-in-stock-ordering-section-3)

    return 0; //temporal cap
  },

  countOnHand: function () {
    let stockItems = StockItems.find({'ingredient.id': this.ingredient.id});

    let totalOnHand = 0;
    stockItems.forEach((stockItem) => totalOnHand += stockItem.count);
    return totalOnHand;
  },

  isEditable: function () {
    let order = Orders.findOne({_id: this.orderId});
    return order && !order.orderedThrough;
  }
});


Template.stockOrderItem.events({
  'click .remove-stock-order-button': function (event, tmpl) {
    event.preventDefault();
    let confirmDelete = confirm("Are you sure you want to delete this order?");
    if (confirmDelete) {
      Meteor.call('removeOrderItem', tmpl.data._id, HospoHero.handleMethodResult());
    }
  }
});
