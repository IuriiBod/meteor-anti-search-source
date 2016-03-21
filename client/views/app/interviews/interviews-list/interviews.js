Template.interviews.onCreated(function () {
  let activeFilter = 'Future Interviews';
  this.interviewType = new ReactiveVar(activeFilter);

  this.searchSource = this.AntiSearchSource({
    collection: 'interviews',
    fields: ['interviewee'],
    searchMode: 'local',
    limit: 30
  });

  this.autorun(() => {
    let userId = Meteor.userId();
    var query = {
      $or: [
        {interviewers: userId},
        {createdBy: userId}
      ]
    };

    //if (this.interviewType.get() === activeFilter) {
    //}

    this.searchSource.setMongoQuery(query);
  });

  this.searchSource.search('');
});


Template.interviews.helpers({
  interviews() {
    return Template.instance().searchSource.searchResult({sort: {startTime: 1}});
  },

  filterTypes () {
    return ['Future Interviews', 'All Interviews'];
  },

  activeFilter () {
    return Template.instance().interviewType.get();
  },

  onFilterChange () {
    var tmpl = Template.instance();
    return function (newFilterType) {
      tmpl.interviewType.set(newFilterType);
    };
  }
});


Template.interviews.events({
  'keyup .interviews-search' (event, tmpl) {
    let searchText = event.target.value;
    tmpl.searchSource.search(searchText);
  }
});