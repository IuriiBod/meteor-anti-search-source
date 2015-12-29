Migrations.add({
  version: 44,
  name: "Fix endTime for template shifts",
  up: function () {
    Shifts.find({type: 'template'}).forEach(function (shift) {
      if (shift.endTime) {

        // some values has 3385 year, instead of 1970
        var startTimeMoment = moment(shift.startTime);
        var endTimeMoment = moment(shift.endTime);
        var diffBetweenMoments = endTimeMoment.diff(startTimeMoment, 'days');

        // diff between start and end time should be less than 1
        if (diffBetweenMoments > 0) {
          endTimeMoment = endTimeMoment.subtract(diffBetweenMoments, 'days');
          shift.endTime = endTimeMoment.toDate();
        }
      }

      Shifts.update({_id: shift._id}, shift);
    });
  }
});