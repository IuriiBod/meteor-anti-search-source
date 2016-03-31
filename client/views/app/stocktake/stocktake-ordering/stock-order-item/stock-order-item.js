//context: StockOrder
Template.stockOrderItem.onCreated(function () {
  this.stockItemsNeededCount = new ReactiveVar();

  Meteor.call('countOfNeededOrderItems', this.data, (error, result) => {
    if (error) {
      this.stockItemsNeededCount.set('-');
    }
    this.stockItemsNeededCount.set(result);
  });
});

Template.stockOrderItem.onRendered(function () {
  let tmpl = this;

  let focusOnNextEditable = function (currentDomElement) {
    let nextEditables = $(currentDomElement).closest('tr').next();
    if (nextEditables.length > 0) {
      nextEditables.find('a.ordering-count').click();
    }
  };

  let onCountChanged = function (response, newValue) {
    if (newValue) {
      let count = parseFloat(newValue) || 0;
      if (_.isFinite(count) && count >= 0) {
        let currentDomElement = this;

        let orderItem = tmpl.data;
        orderItem.orderedCount = count;
        Meteor.call('updateOrderItem', orderItem, HospoHero.handleMethodResult(() => {
          focusOnNextEditable(currentDomElement);
        }));
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
    const tmpl = Template.instance();
    return tmpl.stockItemsNeededCount.get();
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
