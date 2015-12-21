Template.stockModalItem.onCreated(function () {
  this.getCostPerPortionUsed = function () {
    var costPerPortionUsed = 0;
    if ((this.data.stock.costPerPortion > 0) && (this.data.stock.unitSize > 0)) {
      costPerPortionUsed = this.data.stock.costPerPortion / this.data.stock.unitSize;
      costPerPortionUsed = Math.round(costPerPortionUsed * 100) / 100;
      if (costPerPortionUsed === 0) {
        costPerPortionUsed = 0.001;
      }
    }
    return costPerPortionUsed;
  };
});

Template.stockModalItem.helpers({
  stockItem: function () {
    return Template.instance().data.stock;
  },
  costPerPortionUsed: function () {
   return  Template.instance().getCostPerPortionUsed();
  }
});

Template.stockModalItem.events({
  'click .add-ing-checkbox': function (event, tmpl) {
    if (typeof tmpl.data.onAddStockItem === 'string') {
      var specialArea = tmpl.data.onAddStockItem;
      Meteor.call("assignStocksToAreas", tmpl.data.stock._id, specialArea, HospoHero.handleMethodResult());
    } else {
      tmpl.data.onAddStockItem(tmpl.data.stock._id);
    }
  }
});