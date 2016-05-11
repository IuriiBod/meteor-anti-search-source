// context collection: String, titleField: String, onSearchFinished: function

Template.itemsPaletteSearch.onCreated(function () {
  this.searchSource = this.AntiSearchSource({
    collection: this.data.collection,
    fields: [this.data.titleField],
    searchMode: 'local'
  });
});


Template.itemsPaletteSearch.onRendered(function () {
  this.onSearch = () => {
    let searchString = this.$('.items-palette-filter').val();
    this.searchSource.search(searchString);
    this.data.onSearchFinished(this.searchSource);
  };

  this.autorun(() => {
    let data = Template.currentData();
    this.searchSource.setMongoQuery(data.queryOptions);
    this.onSearch();
  });
});


Template.itemsPaletteSearch.events({
  'keyup .items-palette-filter': _.throttle(function (event, tmpl) {
    tmpl.onSearch();
  }, 500, {leading: false})
});