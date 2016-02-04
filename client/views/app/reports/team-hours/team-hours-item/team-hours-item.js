//context: user (User), tableViewMode ("shifts"/"hours"), weekDate (WeekDate)
Template.teamHoursItem.onCreated(function () {
  this.getTotalTimeAndWage = function (templateData) {
    let dateForWeek = HospoHero.dateUtils.getDateByWeekDate(templateData.weekDate);

    let weekShifts = Shifts.find({
      assignedTo: templateData.user._id,
      startTime: TimeRangeQueryBuilder.forWeek(dateForWeek)
    });

    let wageCalculator = new WageCalculator(this.data.user, weekShifts);
    return wageCalculator.getTotalTimeAndWage();
  };

  this.autorun(() => {
    let data = Template.currentData();
    let weeklyValues = this.getTotalTimeAndWage(data);
    this.set('weeklyValues', weeklyValues);
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
    return weeklyValues && weeklyValues.wage >= 0;
  },
  isShowShifts: function () {
    return this.tableViewMode === 'shifts';
  }
});


let WageCalculator = class {
  constructor(user, weekShifts) {
    this.user = user;
    this.weekShifts = weekShifts;
    this.DailyHoursManager = class {
      constructor() {
        this._minutes = [0, 0, 0, 0, 0, 0, 0];
      }

      addMinutes(date, duration) {
        var dayNumber = date.weekday();
        this._minutes[dayNumber] += duration;
      }

      getHours() {
        return this._minutes.map((value) => HospoHero.misc.rounding(value / 60))
      }
    }
  }

  _calculateWageForShift(shiftStartDate, shiftDurationInMinutes) {
    let userPayRatePerHour = HospoHero.misc.getUserPayRate(this.user, shiftStartDate);
    let userPayRatePerMinute = userPayRatePerHour / 60;
    return userPayRatePerMinute * shiftDurationInMinutes;
  };

  _getShiftDuration(startDate, finishDate) {
    let shiftDurationInHours = finishDate.diff(startDate, 'hours');
    if (shiftDurationInHours > 24) { // If duration is more than 24 hours it means error in saving clock out time
      finishDate = finishDate.subtract(24, 'hours');
    }
    return shiftDuration = finishDate.diff(startDate, 'minutes');
  }

  getTotalTimeAndWage() {
    if (this.weekShifts.count() <= 0) {
      return false;
    }

    let dailyHoursManager = new this.DailyHoursManager();
    let totalMinutes = 0;
    let totalWage = 0;

    this.weekShifts.forEach((shift) => {
      if (shift.startedAt || shift.finishedAt) {
        let locationStart = HospoHero.dateUtils.getDateMomentForLocation(shift.startedAt, shift.relations.locationId);
        let locationFinish = HospoHero.dateUtils.getDateMomentForLocation(shift.finishedAt, shift.relations.locationId);

        totalMinutes += this._getShiftDuration(locationStart, locationFinish);
        totalWage += this._calculateWageForShift(locationStart, shiftDuration);
        dailyHoursManager.addMinutes(locationStart, shiftDuration);
      }
    });

    return {
      wage: HospoHero.misc.rounding(totalWage),
      time: HospoHero.misc.rounding(totalMinutes / 60),
      dailyHours: dailyHoursManager.getHours()
    }
  }
};