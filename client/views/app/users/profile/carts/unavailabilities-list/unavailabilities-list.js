Template.userUnavailabilitiesList.helpers({
  unavailabilities: function () {
    var today = moment().startOf('day').toDate();
    var user = Meteor.users.findOne({_id: this._id});
    var unavailabilities = user && user.unavailabilities || false;

    return _.filter(unavailabilities, function (unavailability) {
      return unavailability.repeat === 'never' && unavailability.startDate >= today ||
        unavailability.repeat !== 'never';
    });
  },

  leaveRequests: function () {
    var startOfDay = moment().startOf('day').toDate();
    return LeaveRequests.find({
      userId: this._id,
      $or: [
        {startDate: {$gte: startOfDay}},
        {endDate: {$gte: startOfDay}}
      ]
    });
  },

  intervalDateFormat: function (startDate, endDate, formatType) {
    var formatInterval = function (startDate, startDateFormat, endDate, endDateFormat) {
      var format = function (date, format) {
        return moment(date).format(format);
      };
      return format(startDate, startDateFormat) + ' - ' + format(endDate, endDateFormat);
    };

    var dateFormat = 'ddd DD/MM/YYYY';
    var timeFormat = 'HH:mm A';

    if (formatType === 'dateOnly') {
      return formatInterval(startDate, dateFormat, endDate, dateFormat);
    } else if (formatType === 'dateTime') {
      return formatInterval(startDate, dateFormat + ' ' + timeFormat, endDate, timeFormat);
    } else {
      return '';
    }
  },

  leaveRequestStatusClass: function (status) {
    return status === 'awaiting' ? 'warning' : status === 'approved' ? 'success' : 'danger';
  }
});