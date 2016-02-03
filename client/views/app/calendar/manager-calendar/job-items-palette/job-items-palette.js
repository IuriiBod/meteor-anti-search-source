Template.jobItemsPalette.onCreated(function () {
  this.searchSource = this.AntiSearchSource({
    collection: 'jobItems',
    fields: ['name', 'recipe', 'description'],
    searchMode: 'local'
  });

  // when jop type changes, set new mongo query
  var self = this;
  this.autorun(function () {
    self.searchSource.setMongoQuery({frequency: {$exists: false}});
  });
  this.searchSource.search('');
});


Template.jobItemsPalette.helpers({
  jobItems: function () {
    return Template.instance().searchSource.searchResult({sort: {name: 1}});
  }
});


Template.jobItemsPalette.events({
  'keyup .job-items-palette-filter': _.throttle(function (event, tmpl) {
    var value = tmpl.$(event.target).val();
    tmpl.searchSource.search(value);
  }, 500)
});