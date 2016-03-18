// Maybe we should to make a separate method for quick fix the bug with
// unpublished shifts, if it will be repeat in the future

Migrations.add({
  version: 65,
  name: 'Force shifts publishing',
  up: function () {
    let startDate = moment(new Date());

    function publishShifts (areaId, date) {
      let timeQuery = TimeRangeQueryBuilder.forWeek(date);
      Shifts.update({
        startTime: timeQuery,
        published: false,
        'relations.areaId': areaId
      }, {
        $set: {published: true}
      }, {
        multi: true
      });
    }

    function areaCycle (areaId, startDate, endDate) {
      if (startDate.isBefore(endDate)) {
        publishShifts(areaId, startDate);
        startDate = moment(startDate).add(7, 'days');
        areaCycle(areaId, startDate, endDate);
      }
    }

    Areas.find().forEach((area) => {
      let lastShift = Shifts.findOne({published: true, 'relations.areaId': area._id}, {sort: {startTime: -1}});
      let endDate = moment(lastShift.startTime);

      areaCycle(area._id, moment(startDate), moment(endDate));
    });
  }
});
