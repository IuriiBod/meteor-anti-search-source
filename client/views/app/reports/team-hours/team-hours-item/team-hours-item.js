//context: user (User), tableViewMode ("shifts"/"hours"), weekDate (WeekDate)

Template.teamHoursItem.onCreated(function () {
  this.getUserPayRate = function (date) {
    var user = this.data.user;
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

  this.getTotalTimeAndWage = function (templateData) {
    var dateForWeek = HospoHero.dateUtils.getDateByWeekDate(templateData.weekDate);

    var weekShifts = Shifts.find({
      "assignedTo": templateData.user._id,
      "shiftDate": TimeRangeQueryBuilder.forWeek(dateForWeek)
    });

    var self = this;
    var dailyHoursManager = getDailyHoursManager();
    var totalMinutes = 0;
    var totalWage = 0;

    weekShifts.forEach(function (shift) {
      if (shift.startedAt || shift.finishedAt) {
        var locationStart = moment(shift.startedAt);
        var locationFinish = moment(shift.finishedAt);
        // I don't know why, but some shifts have startedAt in one day and finishedAt in another
        locationFinish.set({
          date: locationStart.date(),
          month: locationStart.month(),
          year: locationStart.year()
        });

        var shiftDuration = locationFinish.diff(locationStart, 'minutes');

        totalMinutes += shiftDuration;
        totalWage += (self.getUserPayRate(locationStart) / 60) * shiftDuration;
        dailyHoursManager.addMinutes(locationStart, shiftDuration);
      }
    });

    if (weekShifts.count() > 0) {
      return {
        wage: roundNumber(totalWage),
        time: roundNumber(totalMinutes / 60), // convert to hours and round
        dailyHours: dailyHoursManager.getHours()
      }
    } else {
      return false;
    }
  };

  var tmpl = this;
  this.autorun(function () {
    var data = Template.currentData();
    var weeklyValues = this.getTotalTimeAndWage(data);
    tmpl.set('weeklyValues', weeklyValues);
  });
});


Template.teamHoursItem.helpers({
  hasActiveTime: function () {
    return this > 0;
  },
  weekDays: function () {
    return HospoHero.dateUtils.getWeekDays(this.weekDate);
  },
  hasWage: function (weeklyValues) {
    return weeklyValues.wage >= 0;
  },
  isShowShifts: function () {
    return this.tableViewMode === 'shifts';
  }
});

var roundNumber = function (number) {
  return Math.round(number * 100) / 100;
};

var getDailyHoursManager = function () {
  var res = [];
  for (var i = 0; i < 7; i++) {
    res[i] = 0;
  }

  return {
    _minutes: res,
    addMinutes: function (date, duration) {
      var dayNumber = moment(date).day() - 1; //because week in moment starts from sunday
      this._minutes[dayNumber] += duration;
    },
    getHours: function () {
      return this._minutes.map(function (minutesValue) {
        return roundNumber(minutesValue / 60);
      })
    }
  };
};
