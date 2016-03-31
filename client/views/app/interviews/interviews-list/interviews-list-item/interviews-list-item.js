Template.interviewsListItem.helpers({
  interviewTimeInterval () {
    return this.startTime ? HospoHero.dateUtils.dateInterval(this.startTime, this.endTime) : 'No time set';
  }
});

Template.interviewsListItem.events({
  'click .interview-list-item': function (event, tmpl) {
    Router.go('interviewDetails', {id: tmpl.data._id});
  }
});