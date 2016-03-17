Migrations.add({
  version: 67,
  name: 'Remove shifts with wrong date. Shifts with wrong date not shown in template and cause error',
  up: function () {
    var dateRange = TimeRangeQueryBuilder.forWeek(moment(0).week(2).startOf('isoweek'));
    Shifts.remove({
      type: 'template',
      $or: [
        {
          startTime: {
            $lt: dateRange.$gte
          }
        }, {
          endTime: {
            $gt: dateRange.$lte
          }
        }
      ]
    });

  }
});