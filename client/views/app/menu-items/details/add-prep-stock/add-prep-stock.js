//context: MenuItem
Template.addPrepStockModal.onCreated(function () {
  var self = this;
  var mapMenuItemEntryIds = function (entryName) {
    var entry = self.data[entryName];
    return _.isArray(entry) && entry.map(function (item) {
        return item._id
      }) || [];
  };

  var prepJobType = JobTypes.findOne({name: 'Prep'});

  var defaultLimit = 5;
  this.jobItemsSearch = this.AntiSearchSource({
    collection: 'jobItems',
    fields: ['name'],
    searchMode: 'local',
    mongoQuery: {
      _id: {$nin: mapMenuItemEntryIds('jobItems')},
      type: prepJobType._id
    },
    limit: defaultLimit
  });

  this.ingredientsSearch = this.AntiSearchSource({
    collection: 'ingredients',
    fields: ['code', 'description'],
    searchMode: 'local',
    mongoQuery: {
      _id: {$nin: mapMenuItemEntryIds('ingredients')}
    },
    limit: defaultLimit
  });


  this.doSearch = function (text) {
    this.jobItemsSearch.search(text);
    this.ingredientsSearch.search(text);
  };
});


Template.addPrepStockModal.helpers({
  getJobItems: function () {
    return Template.instance().jobItemsSearch.searchResult({
      transform: function (matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      sort: {'name': 1}
    });
  },

  getIngredients: function () {
    return Template.instance().ingredientsSearch.searchResult({
      transform: function (matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      sort: {'code': 1}
    });
  }
});


Template.addPrepStockModal.events({
  'keyup .prep-stock-search': _.throttle(function (event, tmpl) {
    var text = $(event.target).val().trim();
    tmpl.doSearch(text);
  }, 200)
});


