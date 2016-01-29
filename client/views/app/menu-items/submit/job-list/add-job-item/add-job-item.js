Template.addJobItem.onCreated(function () {
  this.onItemsAdded = this.data.onItemsAdded;
  this.jobItemsSearch = this.AntiSearchSource({
    collection: 'jobItems',
    fields: ['name'],
    searchMode: 'local',
    limit: 10
  });
  this.idsToExclude = new ReactiveVar(this.data.idsToExclude);
});

Template.addJobItem.helpers({
  availableJobItems: function () {
    var tmpl = Template.instance();
    var query = {_id: {$nin: tmpl.idsToExclude.get()}, status: 'active'};
    tmpl.jobItemsSearch.setMongoQuery(query);
    return tmpl.jobItemsSearch.searchResult({sort: {name: 1}});
  },

  onJobItemSelect: function () {
    var tmpl = Template.instance();
    return function (jobItemId) {
      var idsToExclude = tmpl.idsToExclude.get();
      idsToExclude.push(jobItemId);
      tmpl.idsToExclude.set(idsToExclude);
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