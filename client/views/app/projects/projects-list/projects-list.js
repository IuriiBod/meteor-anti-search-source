Template.projectsList.onCreated(function () {
  let activeFilter = 'Future Projects';
  this.projectType = new ReactiveVar(activeFilter);

  this.searchSource = this.AntiSearchSource({
    collection: 'projects',
    fields: ['title'],
    searchMode: 'local',
    limit: 30
  });

  this.autorun(() => {
    let userId = Meteor.userId();
    var query = {
      $or: [
        {lead: userId},
        {team: userId},
        {createdBy: userId}
      ]
    };

    if (this.projectType.get() === activeFilter) {
      query.startTime = {$gt: new Date()};
    }

    this.searchSource.setMongoQuery(query);
  });

  this.searchSource.search('');
});


Template.projectsList.helpers({
  projects() {
    //return Template.instance().searchSource.searchResult({sort: {startTime: 1}});
    return [];
  },

  filterTypes () {
    return ['Future Projects', 'All Projects'];
  },

  activeFilter () {
    return Template.instance().projectType.get();
  },

  onFilterChange () {
    var tmpl = Template.instance();
    return function (newFilterType) {
      tmpl.projectType.set(newFilterType);
    }
  }
});


Template.projectsList.events({
  'keyup .projects-search' (event, tmpl) {
    let searchText = event.target.value;
    tmpl.searchSource.search(searchText);
  }
});