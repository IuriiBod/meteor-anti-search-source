//context: mode (?), leaveRequestId (ID), currentFlyout (Flyout)
Template.viewLeaveRequest.onCreated(function () {
  this.subscribe('leaveRequestsApprovers');

  this.changeLeaveRequestStatus = function (status) {
    var leaveRequestId = this.data.leaveRequestId;
    status = status ? 'approved' : 'declined';
    Meteor.call('changeLeaveRequestStatus', leaveRequestId, status, HospoHero.handleMethodResult(function () {
      Router.go('home');
    }));
  };

  this.getCurrentLeaveRquest = function () {
    return LeaveRequests.findOne({_id: this.data.leaveRequestId});
  };
});


Template.viewLeaveRequest.onRendered(function () {
  var self = this;

  // Get a current flyout
  self.currentFlyout = FlyoutManager.getInstanceByElement(self.$('.view-leave-request'));

  // Define a dateTimePickers
  self.$('.start-date-picker').datetimepicker({
    format: 'YYYY MMM Do',
    minDate: moment(),
    defaultDate: moment()
  });
  self.$('.end-date-picker').datetimepicker({
    format: 'YYYY MMM Do',
    minDate: moment().add(1, 'day'),
    defaultDate: moment().add(1, 'day')
  });

  // Events for dateTimePicker
  // Set minDate for end-date-picker, that equals date of start-date-picker,
  // and change date on end-time-picker, if current date less than minDate
  self.$(".start-date-picker").on("dp.change", function (e) {
    var endDatePicker = self.$('.end-date-picker').data("DateTimePicker");
    endDatePicker.minDate(e.date.add(1, 'day'));

    if (endDatePicker.minDate() > endDatePicker.date()) {
      endDatePicker.date(endDatePicker.minDate());
    }
  });
});


Template.viewLeaveRequest.helpers({
  leaveRequest: function () {
    return Template.instance().getCurrentLeaveRquest();
  },

  isReviewMode: function (leaveRequest) {
    return this.mode == 'review' && leaveRequest;
  },

  canBeApprovedOrDeclined: function (isReviewMode) {
    var leaveRequest = Template.instance().getCurrentLeaveRquest();
    return isReviewMode && !leaveRequest.approved && !leaveRequest.declined;
  },

  managers: function () {
    var managersIds = HospoHero.roles.getUserIdsByAction('approve leave requests');
    managersIds = _.reject(managersIds, function (id) {
      return id == Meteor.userId();
    });

    return Meteor.users.find({_id: {$in: managersIds}});
  },

  formatDate: function (date) {
    return moment(date).format('ddd D MMM');
  }
});


Template.viewLeaveRequest.events({
  'submit .leave-request-form': function (event, tmpl) {
    event.preventDefault();

    var startDate = tmpl.$('.start-date-picker').data('DateTimePicker').date();
    var endDate = tmpl.$('.end-date-picker').data('DateTimePicker').date();
    var notifyManagerId = tmpl.$('.notify-manager-select').val() || '';
    var comment = tmpl.$('.comment-input').val() || '';

    var newLeaveRequest = {
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
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

  'click .decline-button': function (event, tmpl) {
    tmpl.changeLeaveRequestStatus(false);
  }
});
