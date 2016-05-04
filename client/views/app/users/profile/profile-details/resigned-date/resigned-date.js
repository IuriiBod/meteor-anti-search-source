Template.profileResignedDate.onRendered(function () {
  this.$('.open-resigned-date-picker').datepicker({
    startDate: new Date(),
    todayHighlight: true
  });
});

Template.profileResignedDate.helpers({
  resignDate: function () {
    let resignDate = this.profile.resignDate;
    return resignDate ? moment(resignDate).format('MM/DD/YYYY') : false;
  },

  isViewMode: function () {
    let isMe = Meteor.userId() === this._id;
    return !HospoHero.security.hasPermissionInAreaTo("edit user's payrate") || isMe;
  }
});

Template.profileResignedDate.events({
  'click .set-resign-date-button': function (event, tmpl) {
    var userId = tmpl.data._id;
    let resignDate = tmpl.$('.open-resigned-date-picker').datepicker('getDate');

    Meteor.call('setResignDate', userId, resignDate, HospoHero.handleMethodResult());
  },

  'click remove-resign-date-button': function (event, tmpl) {
    let userId = tmpl.data._id;
    Meteor.call('removeResignDate', userId, HospoHero.handleMethodResult());
  }
});