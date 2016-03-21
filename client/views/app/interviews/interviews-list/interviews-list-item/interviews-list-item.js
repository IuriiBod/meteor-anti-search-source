Template.interviewsListItem.helpers({
  interviewTimeInterval () {
    return this.startTime ? HospoHero.dateUtils.dateInterval(this.startTime, this.endTime) : 'No time set';
  },

  status () {
    return this.status || 'created'
  }
});

Template.interviewsListItem.events({
  'click .interview-list-item': function (event, tmpl) {
    Router.go('projectDetails', {id: tmpl.data._id});
  }
});