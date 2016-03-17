Migrations.add({
  version: 67,
  name: 'Remove shifts with wrong date. Shifts with wrong date not shown in template and cause error',
  up: function () {
    var dateRange = TimeRangeQueryBuilder.forWeek(moment(0).week(2).startOf('isoweek'));
    var copiedShifts = Shifts.find({type: 'template', startTime: dateRange}).fetch();

    Shifts.remove({type: 'template'});

    copiedShifts.forEach(function (shift) {
      Shifts.insert(shift);
    });

  }
});