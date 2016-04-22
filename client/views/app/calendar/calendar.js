// context date: (String), type: (String), userId: (MongoId)
Template.calendar.helpers({
  calendarTitle () {
    return this.type === 'manager' ? 'Daily Schedules' : `Calendar of ${HospoHero.username(this.userId)}`;
  },

  isManagerCalendar () {
    return this.type === 'manager';
  },

  isDailyCalendar () {
    return this.type === 'day' || this.type === 'manager';
  },

  usersWithShifts () {
    let queryType = this.type === 'week' ? 'forWeek' : 'forDay';

    let usersWithShifts = Shifts.find({
      startTime: TimeRangeQueryBuilder[queryType](this.date)
    }, {
      sort: {
        assignedTo: 1
      }
    }).map((shift) => shift.assignedTo);

    return _.compact(usersWithShifts);
  },

  weekdays () {
    return HospoHero.dateUtils.getWeekDays(new Date(this.date));
  }
});