//context: mode (?), leaveRequest (leaveRequest), currentFlyout (Flyout)
Template.viewLeaveRequest.onCreated(function () {
  this.subscribe('leaveRequestsApprovers',HospoHero.getCurrentAreaId(Meteor.userId()));
  this.changeLeaveRequestStatus = function (status) {
    var leaveRequest = this.data.leaveRequest;
    status = status ? 'approved' : 'rejected';
    Meteor.call('changeLeaveRequestStatus', leaveRequest._id, status, HospoHero.handleMethodResult(function () {
      Router.go('home');
    }));
  };
});


Template.viewLeaveRequest.onRendered(function () {
  var self = this;

  // Get a current flyout
  self.currentFlyout = FlyoutManager.getInstanceByElement(self.$('.view-leave-request'));

  // Events for dateTimePicker
  // Set minDate for end-date-picker, that equals date of start-date-picker,
  // and change date on end-time-picker, if current date less than minDate
  self.$(".start-date-picker").on("changeDate", function (event) {
    var startDate = moment(event.date).add(1, 'day').toDate();
    var endDatePicker = self.$('.end-date-picker');

    if (startDate > endDatePicker.datepicker('getDate')) {
      endDatePicker.datepicker('setDate', startDate);
    }
    endDatePicker.datepicker('setStartDate', startDate);
  });
});


Template.viewLeaveRequest.helpers({
  leaveRequest: function () {
    return this.leaveRequest;
  },

  isReviewMode: function (leaveRequest) {
    return this.mode === 'review' && leaveRequest;
  },

  canBeApprovedOrDeclined: function (isReviewMode) {
    return isReviewMode && !this.leaveRequest.approved && !this.leaveRequest.declined;
  },

  managers: function () {
    var managersIds = HospoHero.roles.getUserIdsByAction('approve leave requests');
    managersIds = _.reject(managersIds, function (id) {
      return id === Meteor.userId();
    });

    return Meteor.users.find({_id: {$in: managersIds}});
  },

  formatDate: function (date) {
    return moment(date).format('ddd D MMM');
  },

  defaultEndDate: function () {
    return moment().add(1, 'day').toDate();
  }
});


Template.viewLeaveRequest.events({
  'submit .leave-request-form': function (event, tmpl) {
    event.preventDefault();

    var startDate = tmpl.$('.start-date-picker').datepicker('getDate');
    var endDate = tmpl.$('.end-date-picker').datepicker('getDate');
    var notifyManagerId = tmpl.$('.notify-manager-select').val() || '';
    var comment = tmpl.$('.comment-input').val() || '';

    var newLeaveRequest = {
      startDate: startDate,
      endDate: endDate,
      notifyManagerId: notifyManagerId,
      comment: comment
    };

    Meteor.call('createNewLeaveRequest', newLeaveRequest, HospoHero.handleMethodResult(function () {
      tmpl.currentFlyout.close();
    }));
  },

  'click .approve-button': function (event, tmpl) {
    tmpl.changeLeaveRequestStatus(true);
  },

  'click .reject-button': function (event, tmpl) {
    tmpl.changeLeaveRequestStatus(false);
  }
});
