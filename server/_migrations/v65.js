Migrations.add({
  version: 65,
  name: 'Remove shifts with wrong date (shifts with wrong date not shown in template and cause error)',
  up: function () {
    var removeShifts = function (date) {
      var shiftsCursor = Shifts.find({startTime: date});
      if (shiftsCursor.count()) {
        shiftsCursor.forEach(function (shift) {
          Shifts.remove({_id: shift._id});
        });
      }
    };

    var customDateRange = {
      $gte: new Date('Tue Dec 01 2015 00:00:00'),
      $lte: new Date('Thu Dec 31 2015 23:59:59')
    };

    removeShifts(customDateRange);

    for (var i = 0; i < 4; i++) {
      var day = TimeRangeQueryBuilder.forDay(moment(0).add(i, 'day'));

      removeShifts(day);
    }
  }
});