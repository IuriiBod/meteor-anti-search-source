//context: MenuItem
Template.addPrepStockModal.onCreated(function () {
  var self = this;
  var menuItemEntryIds = function (entry) {
    return _.pluck(entry, '_id');
  };

  var itemsLimit = 5;
  this.ingredientSearchSource = this.AntiSearchSource({
    collection: 'ingredients',
    fields: ['code', 'description'],
    searchMode: 'local',
    limit: itemsLimit
  });

  this.jobItemsSearchSource = this.AntiSearchSource({
    collection: 'jobItems',
    fields: ['name'],
    searchMode: 'local',
    limit: itemsLimit
  });

  var prepJobType = JobTypes.findOne({name: 'Prep'});
  this.autorun(function () {
    var ingredientQuery = {
      _id: {
        $nin: menuItemEntryIds(Template.currentData().ingredients)
      },
      status: 'active'
    };
    self.ingredientSearchSource.setMongoQuery(ingredientQuery);

    var jobItemsQuery = {
      _id: {
        $nin: menuItemEntryIds(Template.currentData().jobItems)
      },
      status: 'active',
      type: prepJobType._id
    };
    self.jobItemsSearchSource.setMongoQuery(jobItemsQuery);
  });

  this.doSearch = function (text) {
    this.ingredientSearchSource.search(text);
    this.jobItemsSearchSource.search(text);
  };

  this.doSearch('');
});

Template.addPrepStockModal.helpers({
  getJobItems: function () {
    return Template.instance().jobItemsSearchSource.searchResult({sort: {name: 1}});
  },

  getIngredients: function () {
    return Template.instance().ingredientSearchSource.searchResult({sort: {code: 1}});
  }
});

Template.addPrepStockModal.events({
  'keyup .prep-stock-search': _.throttle(function (event, tmpl) {
    var text = event.target.value.trim();
    tmpl.doSearch(text);
  }, 500)
});


