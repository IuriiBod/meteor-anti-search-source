Migrations.add({
  version: 9,
  name: "Changing shift dates from timestamps to Date objects",
  up: function () {
    var shifts = Shifts.find();

    if (shifts.count()) {
      shifts.forEach(function (shift) {
        Shifts.update({
          _id: shift._id
        }, {
          $set: {
            startTime: moment(shift.startTime).toDate(),
            endTime: moment(shift.endTime).toDate(),
            shiftDate: moment(shift.shiftDate).startOf('day').toDate()
          }
        });
      })
    }
  }
});