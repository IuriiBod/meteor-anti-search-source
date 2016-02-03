//context: MenuItem
Template.prepList.onCreated(function () {
  this.jobItemsSearch = this.AntiSearchSource({
    collection: 'jobItems',
    fields: ['name'],
    searchMode: 'local',
    limit: 10
  });
  this.idsToExclude = new ReactiveVar(this.data.idsToExclude);
  this.jobItemsSearch.search('');
});

Template.prepList.helpers({
  jobItems() {
    let tmpl = Template.instance();
    let query = {_id: {$nin: tmpl.idsToExclude.get()}};
    tmpl.jobItemsSearch.setMongoQuery(query);
    return tmpl.jobItemsSearch.searchResult({
      transform: function (matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      sort: {name: 1}
    });
  },

  onAddPrepItem() {
    let tmpl = Template.instance();
    return function(stockId) {
      let idsToExclude = tmpl.idsToExclude.get();
      idsToExclude.push(stockId);
      tmpl.idsToExclude.set(idsToExclude);
      tmpl.data.onAddPrepItem(stockId);
    };
  }
});

Template.prepList.events({
  'keyup .prep-stock-search': _.throttle(function (event, tmpl) {
    let text = event.target.value.trim();
    tmpl.jobItemsSearch.search(text);
  }, 500)
});


