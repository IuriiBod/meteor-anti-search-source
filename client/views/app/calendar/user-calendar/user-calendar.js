Template.userCalendar.onCreated(function () {
  const calendarUiStatesManager = UIStates.getManagerFor('calendar');
  calendarUiStatesManager.setState('lastViewDate', this.data.date);
  calendarUiStatesManager.setState('type', this.data.type);
});