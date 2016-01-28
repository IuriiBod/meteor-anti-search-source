Template.stocksList.onCreated(function () {
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


Template.stocksList.helpers({
  ingredients: function () {
    return Template.instance().searchSource.searchResult({
      transform: function (matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>");
      }
    });
  },
  onAddStockItem: function () {
    var tmplParentData = Template.parentData();
    if (tmplParentData && tmplParentData.modalStockListParams) {
      return tmplParentData.modalStockListParams.onAddStockItem || tmplParentData.modalStockListParams.activeSpecialArea;
    }
  }
});

Template.stocksList.events({
  'click .add-new-ingredient': function () {
    FlyoutManager.open('ingredientEditor', {ingredient: null});
  },
  'keyup .search-for-stocks-input': _.throttle(function (e, tmpl) {
    var value = $(e.target).val();
    tmpl.searchSource.search(value);
  }, 500)
});

