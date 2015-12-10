Template.stockModalItemNoShit.onCreated(function () {
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

Template.stockModalItemNoShit.helpers({
  stockItem: function () {
    return Template.instance().data.stock;
  },
  costPerPortionUsed: function () {
   return  Template.instance().getCostPerPortionUsed();
  }
});

Template.stockModalItemNoShit.events({
  'click .add-ing-checkbox': function (e, tmpl) {
    tmpl.data.onAddStockItem(tmpl.data.stock._id)
  }
})