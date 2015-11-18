var component = FlowComponents.define('weekPicker', function (props) {
  this.onDateChangedCallback = props.onDateChanged;
  this.set('weekDate', {week: props.week, year: props.year});
});


component.prototype.isWeekDatesEqual = function (dateA, dateB) {
  return dateA.year === dateB.year && dateA.week === dateB.week;
};


component.action.onDateChanged = function (newWeekDate) {
  console.log('ondatechanged', newWeekDate);

  var currentWeekDate = this.get('weekDate');
  if (!this.isWeekDatesEqual(newWeekDate, currentWeekDate)) {
    this.set('weekDate', newWeekDate);
    if (this.onDateChangedCallback) {
      console.log('callback');
      this.onDateChangedCallback(newWeekDate);
    }
    return newWeekDate;
  }
  return false;
};


component.action.getCurrentWeekDate = function () {
  return this.get('weekDate');
};


component.state.currentWeekStr = function () {
  var weekDate = this.get('weekDate');
  var weekStartEnd = moment().set('year', weekDate.year).set('week', weekDate.week);
  var firstDay = moment(weekStartEnd).startOf('isoweek');
  var lastDay = moment(weekStartEnd).endOf('isoweek');

  var currentDate;
  if (firstDay.year() != lastDay.year()) {
    currentDate = firstDay.format('D MMM YYYY - ') + lastDay.format('D MMM YYYY');
  } else {
    if (firstDay.month() != lastDay.month()) {
      currentDate = firstDay.format('D MMM - ') + lastDay.format('D MMM YYYY');
    } else {
      currentDate = firstDay.format('D - ') + lastDay.format('D MMM YYYY');
    }
  }
  currentDate += ", week " + weekDate.week;
  return currentDate.toUpperCase();
};