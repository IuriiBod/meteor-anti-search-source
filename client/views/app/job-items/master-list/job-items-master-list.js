Template.jobItemsList.onCreated(function () {
  this.searchSource = this.AntiSearchSource({
    collection: 'jobItems',
    fields: ['name', 'recipe', 'description'],
    searchMode: 'local',
    mongoQuery: {
      status: this.data.status,
      type: JobTypes.findOne({name: this.data.type})._id
    },
    limit: 10
  });

  this.searchSource.search('');
});

Template.jobItemsList.helpers({
  jobItems: function () {
    return Template.instance().searchSource.searchResult();
  },
  type: function () {
    return JobTypes.findOne({name: Template.instance().data.type})._id;
  },
  isRecurring: function () {
    return Template.instance().data.type == 'Recurring';
  }
});

Template.jobItemsList.events({
  'keyup .search-job-items-box': _.throttle(function (e, tmpl) {
    var value = $(e.target).val();
    tmpl.searchSource.search(value);
  }, 1500)
});