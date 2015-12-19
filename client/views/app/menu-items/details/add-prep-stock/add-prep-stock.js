//context: MenuItem
Template.addPrepStockModal.onCreated(function () {
  var self = this;
  var mapMenuItemEntryIds = function (entryName) {
    var entry = self.data[entryName];
    return _.isArray(entry) && entry.map(function (item) {
        return item._id
      }) || [];
  };

  //todo: replace it with anti-search-source
  var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
  };
  this.JobItemsSearch = new SearchSource('jobItemsSearch', ['name'], options);

  this.IngredientsSearch = new SearchSource('ingredients', ['code', 'description'], options);

  var prepJobType = JobTypes.findOne({name: 'Prep'});

  this.doSearch = function (text) {
    var defaultLimit = 5;
    this.JobItemsSearch.search(text, {
      _id: {$nin: mapMenuItemEntryIds('jobItems')},
      type: prepJobType._id,
      limit: defaultLimit
    });

    this.IngredientsSearch.search(text, {
      _id: {$nin: mapMenuItemEntryIds('ingredients')},
      limit: defaultLimit
    });
  };

  this.doSearch('');
});

Template.addPrepStockModal.helpers({
  getJobItems: function () {
    return Template.instance().JobItemsSearch.getData({
      transform: function (matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      sort: {'name': 1}
    });
  },

  getIngredients: function () {
    return Template.instance().IngredientsSearch.getData({
      transform: function (matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      sort: {'code': 1}
    });
  }
});

Template.addPrepStockModal.events({
  'keyup .prep-stock-search': _.throttle(function (event, tmpl) {
    var text = $(e.target).val().trim();
    tmpl.doSearch(text);
  }, 200)
});


