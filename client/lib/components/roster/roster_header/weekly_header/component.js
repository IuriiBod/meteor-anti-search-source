var component = FlowComponents.define('weeklyHeader', function (props) {
  this.set('year', props.year);
  this.set('week', props.week);
  this.set('onDateChanged', props.onDateChanged);
});

component.state.isPublished = function () {
  var weekNo = Session.get("thisWeek");
  var date = moment().week(weekNo);

  this.set('publishedOnDate', date);

  var shiftDateQuery = TimeRangeQueryBuilder.forWeek(date);
  return !!Shifts.findOne({
    shiftDate: shiftDateQuery,
    published: true,
    'relations.areaId': HospoHero.getCurrentAreaId()
  });
};