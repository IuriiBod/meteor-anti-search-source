Migrations.add({
  version: 37,
  name: "Fix shifts times",
  up: function () {
    Locations.find({}).forEach(function (location) {

      var convertToLocalMoment = function (date) {
        return HospoHero.dateUtils.getDateMomentForLocation(moment(date), location);
      };

      var applyDateToTime = function (date, time) {
        return moment(date).hours(time.hours()).minutes(time.minutes());
      };

      Shifts.find({'relations.locationId': location._id}).forEach(function (shift) {
        var shiftMoment = convertToLocalMoment(shift.shiftDate).startOf('day');
        delete shift.shiftDate;

        var startTime = convertToLocalMoment(shift.startTime);
        var endTime = convertToLocalMoment(shift.endTime);
        var duration = endTime.diff(startTime, 'minutes');

        shift.startTime = applyDateToTime(shiftMoment, startTime).toDate();
        shift.endTime = applyDateToTime(shiftMoment, startTime).add(duration, 'minutes').toDate();

        var startedAt, finishedAt;

        if (shift.startedAt && shift.finishedAt) {
          startedAt = convertToLocalMoment(shift.startedAt);
          finishedAt = convertToLocalMoment(shift.finishedAt);
          duration = finishedAt.diff(startedAt, 'minutes');
        }

        delete shift.startedAt;
        delete shift.finishedAt;

        if (shift.startedAt && shift.finishedAt) {
          shift.startedAt = applyDateToTime(shiftDate, startedAt).toDate();
          shift.finishedAt = applyDateToTime(shiftDate, startedAt).add(duration, 'minutes').toDate();
        }

        Shifts.update({_id: shift._id}, shift);
      });
    });
  }
});
