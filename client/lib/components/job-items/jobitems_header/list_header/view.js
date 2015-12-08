Template.jobListHeader.events({
  'click .subscribeJobsList': function (e) {
    e.preventDefault();
    FlowComponents.callAction('subscribe');
  }
});