Migrations.add({
  version: 43,
  name: "Convert dates in shift to one format. Publish all shifts, that should be published",
  up: function () {
    Shifts.find().forEach(function (shift) {
      if (shift.startTime) {
        shift.startTime = new Date(shift.startTime);
      }
      if (shift.endTime) {
        shift.endTime = new Date(shift.endTime);
      }
      if (shift.startedAt) {
        shift.startedAt = new Date(shift.startedAt);
      }
      if (shift.finishedAt) {
        shift.finishedAt = new Date(shift.finishedAt);
      }
      if (shift.publishedOn) {
        shift.publishedOn = new Date(shift.publishedOn);
      }
    });

    Shifts.find({published: false}).forEach(function (shift) {
      var shiftWeekTimeRange = TimeRangeQueryBuilder.forWeek(shift.startTime);
      var publishedShiftForThisWeek = Shifts.findOne({startTime: shiftWeekTimeRange, published: true});
      if (publishedShiftForThisWeek) {
        Shifts.update({_id: shift._id}, {$set: {published: true, publishedOn: publishedShiftForThisWeek.publishedOn}});
      }
    });
  }
});