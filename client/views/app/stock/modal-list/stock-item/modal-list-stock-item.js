Template.stockModalItem.onCreated(function () {
  this.getCostPerPortionUsed = function () {
    var costPerPortionUsed = 0;
    var stock = this.data.stock;
    if ((stock.costPerPortion > 0) && (stock.unitSize > 0)) {
      costPerPortionUsed = stock.costPerPortion / stock.unitSize;
      costPerPortionUsed = HospoHero.misc.rounding(costPerPortionUsed);
      if (costPerPortionUsed === 0) {
        costPerPortionUsed = 0.001;
      }
    }
    return costPerPortionUsed;
  };
});

Template.stockModalItem.onRendered(function () {
  this.$('.i-checks').iCheck({
    checkboxClass: 'icheckbox_square-green'
  });
});

Template.stockModalItem.helpers({
  stockItem: function () {
    return Template.instance().data.stock;
  },
  costPerPortionUsed: function () {
    return Template.instance().getCostPerPortionUsed();
  }
});

Template.stockModalItem.events({
  'ifChecked .add-ing-checkbox': function (event, tmpl) {
    if (_.isFunction(tmpl.data.onAddStockItem)) {
      tmpl.data.onAddStockItem(tmpl.data.stock._id);
    } else {
      Meteor.call("assignStocksToAreas", tmpl.data.stock._id, tmpl.data.onAddStockItem, HospoHero.handleMethodResult());
    }
  }
});

Template.stockModalItem.onDestroyed(function () {
  this.$('.i-checks').iCheck('destroy');
});