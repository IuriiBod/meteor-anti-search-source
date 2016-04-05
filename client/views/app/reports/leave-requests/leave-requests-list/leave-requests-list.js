Template.leaveRequestsList.onCreated(function () {
  this.page = new Blaze.ReactiveVar(1);
  const currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
  this.autorun(() => {
    let limit = this.page.get() * this.data.itemPerPage;
    let managerStatus = this.data.filter.get();
    this.subscribe('leaveRequestsInArea', currentAreaId, limit, managerStatus);
  });
});

Template.leaveRequestsList.helpers({
  leaveRequestsItems() {
    let query = {};
    let managerStatus = this.filter.get();
    if (managerStatus && managerStatus !== 'all') {
      _.extend(query, {'status.value': managerStatus});
    }
    return LeaveRequests.find(query);
  },
  isHasMoreItems () {
    let page = Template.instance().page.get();
    return LeaveRequests.find().count() / (page * this.itemPerPage) >= 1;
  },
  headers(){
    return ['User', 'Start Date', 'End Date', 'Status', 'Comment'];
  },
  filterValue(){
    let res = this.filter.get();
    return res === 'approved' ? '(Approved)' : res === 'rejected' ? '(Rejected)' : '';
  }
});
Template.leaveRequestsList.events({
  'click .load-more': (event, tmpl) => {
    event.preventDefault();
    var page = tmpl.page.get();
    tmpl.page.set(page + 1);
  }
});
