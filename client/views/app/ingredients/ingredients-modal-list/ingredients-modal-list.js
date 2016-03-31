Template.ingredientsModalList.onCreated(function () {
  this.ingredienstSearch = this.AntiSearchSource({
    collection: 'ingredients',
    fields: ['code', 'description'],
    searchMode: 'local',
    limit: 10
  });
  this.idsToExclude = new ReactiveVar(this.data.idsToExclude);
  this.ingredienstSearch.search('');
});


Template.ingredientsModalList.helpers({
  ingredients: function () {
    var tmpl = Template.instance();
    var query = {_id: {$nin: tmpl.idsToExclude.get()}};
    tmpl.ingredienstSearch.setMongoQuery(query);
    return tmpl.ingredienstSearch.searchResult({
      transform: function (matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>");
      },
      sort: {code: 1}
    });
  },
  onAddStockItem: function () {
    var tmpl = Template.instance();
    return function (stockId) {
      var idsToExclude = tmpl.idsToExclude.get();
      idsToExclude.push(stockId);
      tmpl.idsToExclude.set(idsToExclude);
      tmpl.data.onAddStockItem(stockId);
    };
  }
});

Template.ingredientsModalList.events({
  'click .add-new-ingredient': function () {
    FlyoutManager.open('wrapperFlyout', {
      template: 'ingredientEditor',
      title: "Add ingredient",
      data: {
        inFlyout: true,
        ingredient: null
      }
    });
  },
  'keyup .search-for-stocks-input': _.throttle(function (event, tmpl) {
    var value = $(event.target).val();
    tmpl.ingredienstSearch.search(value);
  }, 500, {leading: false})
});

