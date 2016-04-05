Template.leaveRequestsFilter.events({
  'click .filter-status.all'(event, tmpl){
    tmpl.data.filter.set('all');
  },
  'click .filter-status.approved'(event, tmpl){
    tmpl.data.filter.set('approved');
  },
  'click .filter-status.rejected'(event, tmpl){
    tmpl.data.filter.set('rejected');
  }
});