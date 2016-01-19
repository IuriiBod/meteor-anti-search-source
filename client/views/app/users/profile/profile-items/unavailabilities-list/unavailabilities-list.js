Template.unavailabilitiesList.helpers({
  unavailabilities: function () {
    var today = new Date();
    var user = Meteor.users.findOne({_id: this._id});
    var unavailabilities = user && user.unavailabilities || false;

    return _.filter(unavailabilities, function(unavailability) {
      return unavailability.repeat === 'never' && unavailability.startDate >= today ||
             unavailability.repeat !== 'never';
    });
  },

  leaveRequests: function () {
    var startOfDay = moment().startOf('day').toDate();
    return LeaveRequests.find({
      userId: this._id,
      $or: [
        { startDate: {$gte: startOfDay} },
        { endDate: {$gte: startOfDay} }
      ]
    });
  },

  intervalDateFormat: function (startDate, endDate, formatType) {
    var format = function (date, format) {
      return moment(date).format(format);
    };

    var dateFormat = 'ddd DD/MM/YYYY';
    var timeFormat = 'HH:mm A';

    if (formatType === 'dateOnly') {
      return format(startDate, dateFormat) + ' - ' + format(endDate, dateFormat);
    } else if (formatType === 'dateTime') {
      return format(startDate, dateFormat + ' ' + timeFormat) + ' - ' + format(endDate, timeFormat);
    } else {
      return '';
    }
  },

  leaveRequestStatusClass: function (status) {
    return status === 'awaiting' ? 'warning' : status === 'approved' ? 'success' : 'danger';
  }
});