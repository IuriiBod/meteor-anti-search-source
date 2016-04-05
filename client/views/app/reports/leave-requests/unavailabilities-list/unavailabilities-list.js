Template.unavailabilitiesList.onCreated(function () {
  this.page = new Blaze.ReactiveVar(1);
  const currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
  this.autorun(() => {
    let limit = this.page.get() * this.data.itemPerPage;
    let managerStatus = this.data.filter.get();
    this.subscribe('unavailabilitiesInArea', currentAreaId, limit,  managerStatus);
  });
});

Template.unavailabilitiesList.helpers({
  unavailabilityItems() {
    let query = {};
    let managerStatus = this.filter.get();
    if (managerStatus && managerStatus !== 'all') {
      _.extend(query, {'status.value': managerStatus});
    }
    return Unavailabilities.find(query);
  },
  isHasMoreItems () {
    let page = Template.instance().page.get();
    return Unavailabilities.find().count() / (page * this.itemPerPage) >= 1;
  },
  headers(){
    return ['User', 'Start Date', 'End Date', 'Repeat', 'Is All Day', 'Comment'];
  },
  filterValue(){
    let res = this.filter.get();
    return res === 'approved' ? '(Approved)' : res === 'rejected' ? '(Rejected)' : '';
  }
});

Template.unavailabilitiesList.events({
  'click .load-more': (event, tmpl) => {
    event.preventDefault();
    var page = tmpl.page.get();
    tmpl.page.set(page + 1);
  }
});
