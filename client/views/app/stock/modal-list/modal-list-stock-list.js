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
    var currentData = Template.currentData();
    if(currentData.modalStockListParams && currentData.modalStockListParams.stockItemsInListIds) {
      var query = {_id: {$nin: Template.currentData().modalStockListParams.stockItemsInListIds}};
      self.searchSource.setMongoQuery(query);
    }
  });
  this.searchSource.search('');
});


Template.stocksModalList.helpers({
  ingredients: function () {
    return Template.instance().searchSource.searchResult({
      transform: function (matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>");
      }
    });
  },
  showAddStockItemMenu: function () {
    return Template.instance().showAddStockItemMenu.get();
  },
  onAddStockItem: function () {
    var tmplParentData = Template.parentData();
    if (tmplParentData && tmplParentData.modalStockListParams) {
      return tmplParentData.modalStockListParams.onAddStockItem || tmplParentData.modalStockListParams.activeSpecialArea;
    }
  }
});

Template.stocksModalList.events({
  'click .add-new-ingredient': function (e, tmpl) {
    tmpl.ingredientItemEditorModal = ModalManager.open('ingredientItemEditor', {ingredient: null});
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
  }, 500)
});

