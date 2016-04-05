Template.userUnavailabilitiesList.helpers({
  unavailabilities: function () {
    var today = moment().startOf('day').toDate();

    return Unavailabilities.find({
      $or: [
        { repeat: { $not: 'never' } },
        {
          $and:[
            { repeat: 'never' },
            { startDate: { $gte: today } }
          ]
        }
      ]
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
  leaveRequestStatus: function (status) {
    return !status  ? 'Awaiting' : status === 'approved' ? 'Approved' : 'Rejected';
  },
  leaveRequestStatusClass: function (status) {
    return !status  ? 'warning' : status === 'approved' ? 'success' : 'danger';
  }
});