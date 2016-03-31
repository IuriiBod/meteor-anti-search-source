Template.interviews.onCreated(function () {
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

    this.searchSource.setMongoQuery(query);
  });

  this.searchSource.search('');
});


Template.interviews.helpers({
  interviews() {
    return Template.instance().searchSource.searchResult({sort: {createdAt: 1}});
  }
});


Template.interviews.events({
  'keyup .interviews-search' (event, tmpl) {
    let searchText = event.target.value;
    tmpl.searchSource.search(searchText);
  }
});