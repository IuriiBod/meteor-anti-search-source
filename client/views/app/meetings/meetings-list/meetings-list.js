Template.meetingsList.onCreated(function () {
  let activeFilter = 'Future Meeting';
  this.meetingType = new ReactiveVar(activeFilter);

  this.searchSource = this.AntiSearchSource({
    collection: 'meetings',
    fields: ['title'],
    searchMode: 'local',
    limit: 30
  });

  this.autorun(() => {
    let userId = Meteor.userId();
    var query = {
      $or: [
        {attendees: userId},
        {createdBy: userId}
      ]
    };

    if (this.meetingType.get() === activeFilter) {
      query.startTime = {$gt: new Date()};
    }

    this.searchSource.setMongoQuery(query);
  });

  this.searchSource.search('');
});


Template.meetingsList.helpers({
  meetings () {
    return Template.instance().searchSource.searchResult({sort: {startTime: 1}});
  },

  filterTypes () {
    return ['Future Meeting', 'All Meetings'];
  },

  activeFilter () {
    return Template.instance().meetingType.get();
  },

  onFilterChange () {
    var tmpl = Template.instance();
    return function (newFilterType) {
      tmpl.meetingType.set(newFilterType);
    }
  }
});


Template.meetingsList.events({
  'keyup .meetings-search' (event, tmpl) {
    let searchText = event.target.value;
    tmpl.searchSource.search(searchText);
  }
});