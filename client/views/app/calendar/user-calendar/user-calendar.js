Template.userCalendar.onCreated(function () {
  const calendarUiStatesManager = UIStates.getManagerFor('calendar');
  calendarUiStatesManager.setState('lastViewDate', this.data.date);
  calendarUiStatesManager.setState('type', this.data.type);
});


Template.userCalendar.helpers({
  displayCalendar: function () {
    var queryType = HospoHero.calendar.getQueryType(this.type);
    return !!Shifts.findOne({
      assignedTo: this.userId,
      startTime: TimeRangeQueryBuilder[queryType](this.date),
      published: true,
      'relations.areaId': HospoHero.getCurrentAreaId()
    });
  },

  startOfWeekDate: function () {
    var date = moment(this.date, 'YYY-MM-DD').startOf('week');
    return HospoHero.dateUtils.shortDateFormat(date);
  }
});