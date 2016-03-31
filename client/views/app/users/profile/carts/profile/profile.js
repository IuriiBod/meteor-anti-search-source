Template.profile.onRendered(function () {
  $(".open-resigned-date-picker").datepicker({
    startDate: new Date(),
    todayHighlight: true
  });

  $('#datepicker').datepicker({
    todayBtn: true
  });
});

Template.profile.helpers({
  lastLoginDate: function () {
    return this.lastLoginDate &&
      moment.duration(moment().diff(this.lastLoginDate)).humanize() || 'never';
  },
  isCanChangePassword: function () {
    let user = Meteor.user();
    return _.isEmpty(user.services);
  }
});