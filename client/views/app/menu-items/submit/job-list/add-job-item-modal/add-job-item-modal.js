Template.addJobItemModal.onCreated(function () {
  this.set('selectedJobItemIds', []);

  //todo: get rid of search-source
  var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
  };
  var fields = ['name'];
  var prepType = JobTypes.findOne({name: "Prep"});
  this.JobItemsSearch = new SearchSource('jobItemsSearch', fields, options);

  var lastSearchedText = '';
  this.doSearch = function (text) {
    lastSearchedText = text;
    this.JobItemsSearch.search(text, {_id: {$nin: this.data.idsToExclude}, limit: 10, type: prepType._id});
  };

  var tmpl = this;
  this.autorun(function () {
    //triggers when `idsToExclude` was changed
    Template.currentData();
    tmpl.doSearch(lastSearchedText);
  });
});


Template.addJobItemModal.helpers({
  availableJobItems: function () {
    return Template.instance().JobItemsSearch.getData({
      transform: function (matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      sort: {'name': 1}
    });
  },

  getOnSelectionStateChanged: function () {
    var tmpl = Template.instance();
    return function (jobItemId, isSelected) {
      var oldSelectedItems = tmpl.get('selectedJobItemIds');
      var newSelectedItems;
      if (isSelected) {
        //copy array to provide reactivity
        newSelectedItems = oldSelectedItems.map(function (item) {
          return item;
        });
        newSelectedItems.push(jobItemId);
      } else {
        newSelectedItems = _.filter(oldSelectedItems, function (id) {
          return id !== jobItemId;
        });
      }
      tmpl.set('selectedJobItemIds', newSelectedItems);
    };
  },

  isJobItemSelected: function () {
    var selectedItemIds = Template.instance().get('selectedJobItemIds');
    return selectedItemIds.indexOf(this._id) > -1;
  }
});

Template.addJobItemModal.events({
  'keyup .search-input': function (event, tmpl) {
    var text = $(event.target).val().trim();
    tmpl.doSearch(text);
  },

  'click .add-jobs-button': function (event, tmpl) {
    var jobsToAdd = [];
    tmpl.data.onItemsAdded(jobsToAdd);
  }
});