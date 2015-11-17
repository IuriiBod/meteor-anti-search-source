var component = FlowComponents.define("teamHoursItem", function (props) {
  this.set('user', props.user);
  this.tableViewMode = props.tableViewMode;
  this.weekDate = HospoHero.misc.getWeekDateFromRoute(Router.current());

  var weeklyValues = this.getTotalTimeAndWage();

  this.set('weeklyValues', weeklyValues);
});


component.state.weekDays = function () {
  return HospoHero.dateUtils.getWeekDays(this.weekDate);
};


component.state.hasWage = function () {
  var values = this.get('weeklyValues');
  return values.wage >= 0;
};


component.state.isShowShifts = function () {
  return this.tableViewMode === 'shifts';
};


component.prototype.getUserPayRate = function (date) {
  var user = this.get('user');
  if (user.profile && user.profile.payrates) {
    var wageDoc = user.profile.payrates;

    var currentWeekDay = moment(date).format('dddd').toLowerCase();

    var rate = wageDoc[currentWeekDay];
    if (!rate) {
      rate = wageDoc['weekdays']
    }
    return rate;
  } else {
    return 0;
  }
};


component.prototype.roundNumber = function (number) {
  return Math.round(number * 100) / 100;
};


component.prototype.getDailyHoursManager = function () {
  var res = [];
  for (var i = 0; i < 7; i++) {
    res[i] = 0;
  }

  var componentInstance = this;

  return {
    _minutes: res,
    addMinutes: function (date, duration) {
      var dayNumber = moment(date).day() - 1; //because week in moment starts from sunday
      this._minutes[dayNumber] += duration;
    },
    getHours: function () {
      return this._minutes.map(function (minutesValue) {
        return componentInstance.roundNumber(minutesValue / 60);
      })
    }
  };
};


component.prototype.getTotalTimeAndWage = function () {
  var user = this.get('user');
  var dateForWeek = HospoHero.dateUtils.getDateByWeekDate(this.weekDate);

  var weekShifts = Shifts.find({
    "assignedTo": user._id,
    "shiftDate": TimeRangeQueryBuilder.forWeek(dateForWeek)
  });

  var self = this;
  var dailyHoursManager = this.getDailyHoursManager();
  var totalMinutes = 0;
  var totalWage = -1;

  weekShifts.forEach(function (shift) {
    totalWage = 0;

    if(shift.startedAt || shift.finishedAt) {
      var shiftDuration = moment(shift.finishedAt).diff(shift.startedAt, 'minutes');

      totalMinutes += shiftDuration;
      totalWage += (self.getUserPayRate(shift.date) / 60) * shiftDuration;
      dailyHoursManager.addMinutes(shift.shiftDate, shiftDuration);
    }
  });

  return {
    wage: this.roundNumber(totalWage),
    time: this.roundNumber(totalMinutes / 60), // convert to hours and round
    dailyHours: dailyHoursManager.getHours()
  }
};

