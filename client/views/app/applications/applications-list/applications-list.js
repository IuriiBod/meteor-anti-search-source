let statusQuery = (status) => {
  let statusesQuery = {
    'Active': {$ne: 'Rejected'},
    'All': {$exists: true}
  };
  return statusesQuery[status] || status;
};

let positionQuery = (positionName) => {
  let position = Positions.findOne({name: positionName});
  return position ? position._id : {$exists: true};
};


Template.applicationsList.onCreated(function () {
  this.activeStatus = new ReactiveVar('Active');
  this.activePosition = new ReactiveVar('All');

  this.searchSource = this.AntiSearchSource({
    collection: 'applications',
    fields: [
      'details.name'
    ],
    searchMode: 'local',
    limit: 30
  });

  this.autorun(() => {
    let status = this.activeStatus.get();
    let position = this.activePosition.get();

    let query = {
      appProgress: statusQuery(status),
      positionIds: positionQuery(position)
    };

    this.searchSource.setMongoQuery(query);
  });
});


Template.applicationsList.helpers({
  applications () {
    let tmpl = Template.instance();
    return tmpl.searchSource.searchResult({sort: {createdAt: 1}});
  },

  statusFilterTypes () {
    return ['Active', 'All', 'New Application', 'Phone Interview', '1st Interview', '2nd Interview', 'Hired!',
      'On Wait List', 'Rejected'];
  },

  activeStatus () {
    return Template.instance().activeStatus.get();
  },

  onStatusFilterChange () {
    let tmpl = Template.instance();

    return (status) => {
      tmpl.activeStatus.set(status);
    };
  },

  positionsFilterTypes () {
    let positionsNames = this.positions.map(position => position.name);
    positionsNames.unshift('All');
    return positionsNames;
  },

  activePosition () {
    return Template.instance().activePosition.get();
  },

  onPositionFilterChange () {
    let tmpl = Template.instance();

    return (position) => {
      tmpl.activePosition.set(position);
    };
  }
});


Template.applicationsList.events({
  'keyup .applications-search' (event, tmpl) {
    let searchText = event.target.value;
    tmpl.searchSource.search(searchText);
  }
});