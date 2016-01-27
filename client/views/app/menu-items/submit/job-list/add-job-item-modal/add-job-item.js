Template.addJobItem.onCreated(function () {
  this.onItemsAdded = this.data.onItemsAdded;
  this.jobItemsSearch = this.AntiSearchSource({
    collection: 'jobItems',
    fields: ['name'],
    searchMode: 'local',
    limit: 10
  });

  console.log(Template.currentData().idsToExclude());

  var self = this;
  this.autorun(function () {
    //var query = {_id: {$nin: Template.currentData().idsToExclude()}, status: 'active'};
    var query = {status: 'active'};
    self.jobItemsSearch.setMongoQuery(query);
  });
});

Template.addJobItem.helpers({
  availableJobItems: function () {
    return Template.instance().jobItemsSearch.searchResult({sort: {name: 1}});
  },

  onJobItemSelect: function () {
    var tmpl = Template.instance();
    return function (jobItemId) {
      tmpl.data.onItemsAdded(jobItemId);
    }
  }
});

Template.addJobItem.events({
  'keyup .search-input': _.throttle(function (event, tmpl) {
    var text = event.target.value.trim();
    tmpl.jobItemsSearch.search(text);
  })
});