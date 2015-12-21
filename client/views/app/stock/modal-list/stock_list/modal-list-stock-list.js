Template.stocksModalList.onCreated(function () {
  this.showAddStockItemMenu = new ReactiveVar(false);

  this.searchSource = this.AntiSearchSource({
    collection: 'ingredients',
    fields: ['code', 'description'],
    searchMode: 'local',
    limit: 10
  });

  var self = this;
  this.autorun(function () {
    var query = {_id: {$nin: Template.currentData().modalStockListParams.stockItemsInListIds}};
    self.searchSource.setMongoQuery(query);
  });
  this.searchSource.search('');
});


Template.stocksModalList.helpers({
  ingredients: function () {
    return Template.instance().searchSource.searchResult();
    //return Ingredients.find({_id: {$nin: Template.instance().data.modalStockListParams.stockItemsInListIds}}, {limit: 10});
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
  'click .submit-ingredient-button': function (e, tmpl) {
    tmpl.showAddStockItemMenu.set(false);
  },
  'click .ingredient-editor-cancel': function (e, tmpl) {
    e.preventDefault();
    tmpl.showAddStockItemMenu.set(false);
  },

  'keyup .search-input': _.throttle(function (e, tmpl) {
    var value = $(e.target).val();
    tmpl.searchSource.search(value);
  }, 500),
  'click .load-more-items': function (e, tmpl) {
    tmpl.searchSource.incrementLimit(10);
  }
});

