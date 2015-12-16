Template.stocksModalList.onCreated(function () {
  this.showAddStockItemMenu = new ReactiveVar(false);
});

Template.stocksModalList.helpers({
  ingredients: function () {
    return Ingredients.find({_id: {$nin: Template.instance().data.modalStockListParams.stockItemsInListIds}}, {limit: 10});
  },
  showAddStockItemMenu: function () {
    return Template.instance().showAddStockItemMenu.get();
  },
  onAddStockItem: function () {
    return Template.instance().data.modalStockListParams.onAddStockItem;
  }
});

Template.stocksModalList.events({
  'click .add-new-ingredient': function (e, tmpl) {
    tmpl.showAddStockItemMenu.set(true);
  },

  //event for submitIngredient template
  'click #addIngredientBtn': function (e, tmpl) {
    tmpl.showAddStockItemMenu.set(false);
  },
  'click #cancel': function (e, tmpl) {
    tmpl.showAddStockItemMenu.set(false);
  }
});

