var component = FlowComponents.define('weekPicker', function (props) {
  this.onDateChangedCallback = props.onDateChanged;
  this.set('date', new Date());
});

component.getDateByYearAndWeek = function (year, week) {
  return moment(year, 'YYYY').week(week).toDate()
};


component.action.onDateChanged = function (year, week) {
  var newDate = component.getDateByYearAndWeek(year, week);
  if (newDate.valueOf() !== this.get('date').valueOf()) {
    this.set('date', newDate);
    if (this.onDateChangedCallback) {
      this.onDateChangedCallback(newDate);
    }
    console.log('date changed', newDate);
    return newDate;
  }
  return false;
};

component.action.getCurrentDate = function () {
  return this.get('date');
};

component.state.currentDate = function () {
  var date = moment(this.get('date'));

  var firstDay = component.getDateByYearAndWeek(date.year(), date.week());
  console.log('fristday', firstDay);
  var lastDay = moment(firstDay).add(6, 'day').toDate();
  var week = date.week();

  //todo: it should be refactored
  //todo: (use "moment" instead of huge amount of code below with external dependencies)
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

  currentDate += "WEEK " + week;

  return currentDate;
};
