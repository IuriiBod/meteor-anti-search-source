var component = FlowComponents.define('weekPicker', function (props) {
  this.onDateChangedCallback = props.onDateChanged;
  this.set('weekDate', {week: props.week, year: props.year});
});


component.prototype.isWeekDatesEqual = function (dateA, dateB) {
  return dateA.year === dateB.year && dateA.week === dateB.week;
};


component.action.onDateChanged = function (newWeekDate) {
  var currentWeekDate = this.get('weekDate');
  if (!this.isWeekDatesEqual(newWeekDate, currentWeekDate)) {
    this.set('weekDate', newWeekDate);
    if (this.onDateChangedCallback) {
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

  //todo: it should be refactored
  //todo: (use "moment" instead of huge amount of code below with external dependencies)
  var weekStartEnd = getWeekStartEnd(weekDate.week, weekDate.year);
  var firstDay = weekStartEnd.monday;
  var lastDay = weekStartEnd.sunday;


  var firstDayDate = firstDay.getDate();
  var lastDayDate = lastDay.getDate();

  var firstDayMonth = firstDay.getMonth();
  var lastDayMonth = lastDay.getMonth();

  var firstDayMonthName = getMonthName(firstDay.getMonth(), true);
  firstDayMonthName = firstDayMonthName.toUpperCase();
  var lastDayMonthName = getMonthName(lastDay.getMonth(), true);
  lastDayMonthName = lastDayMonthName.toUpperCase();

  var firstDayYear = firstDay.getFullYear();
  var lastDayYear = lastDay.getFullYear();

  var currentDate = "";

  if (firstDayMonth == lastDayMonth) {
    currentDate = firstDayDate + " - " + lastDayDate + " " + firstDayMonthName + ", " + firstDayYear + ", ";
  } else if (firstDayMonth != lastDayMonth) {
    if (firstDayYear == lastDayYear) {
      currentDate = firstDayDate + " " + firstDayMonthName + " - " + lastDayDate + " " + lastDayMonthName + ", " + firstDayYear + ", ";
    } else {
      currentDate = firstDayDate + " " + firstDayMonthName + " " + firstDayYear + " - " + lastDayDate + " " + lastDayMonthName + " " + lastDayYear + ", ";
    }
  }

  currentDate += "WEEK " + weekDate.week;

  return currentDate;
};
