SyncedCron.add({
  name: 'Send emails to users with shift updates',
  schedule: function (parser) {
    return parser.text('every 1 hour');
  },
  job: function () {
    var locationsToUpdate = Locations.find({
      shiftUpdateHour: new Date().getHours()
    });
    locationsToUpdate.forEach(function (location) {
      sendShiftUpdates(location._id);
    })
  }
});

var sendShiftUpdates = function (locationId) {
  var users = ShiftsUpdates.find({
    locationId: locationId
  }).fetch();

  var shiftsGroupedByUser = _.groupBy(users, function (user) {
    return user.to;
  });

  Object.keys(shiftsGroupedByUser).forEach(function (userId) {
    new NotificationSender(
      'Daily shift updates',
      'daily-shift-updates',
      {
        shifts: shiftsGroupedByUser[userId]
      }
    ).sendEmail(userId);
  });

  ShiftsUpdates.remove({
    locationId: locationId
  });

  return true;
};