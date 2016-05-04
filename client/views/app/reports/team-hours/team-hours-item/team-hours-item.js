//context: user (User), tableViewMode ("shifts"/"hours"), weekDate (WeekDate)
Template.teamHoursItem.onCreated(function () {
  this.weeklyValues = new ReactiveVar(false);

  this.getTotalTimeAndWage = function (templateData) {
    let dateForWeek = moment(templateData.weekDate).toDate();

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
    this.weeklyValues.set(weeklyValues);
  });
});


Template.teamHoursItem.helpers({
  weeklyValues: function () {
    return Template.instance().weeklyValues.get();
  },
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
  },
  dailyShifts: function () {
    let userId = Template.parentData(1).user._id;
    let currentDate = this;
    return Shifts.find({
      assignedTo: userId,
      startTime: TimeRangeQueryBuilder.forDay(currentDate)
    });
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
        return this._minutes.map((value) => HospoHero.misc.rounding(value / 60));
      }
    };
  }

  _calculateWageForShift(shiftStartDate, shiftDurationInMinutes) {
    let userPayRatePerHour = HospoHero.misc.getUserPayRate(this.user, shiftStartDate);
    let userPayRatePerMinute = userPayRatePerHour / 60;
    return userPayRatePerMinute * shiftDurationInMinutes;
  }

  _getShiftDuration(shift) {
    return moment(shift.finishedAt).diff(shift.startedAt, 'minutes');
  }

  getTotalTimeAndWage() {
    if (this.weekShifts.count() <= 0) {
      return false;
    }

    let dailyHoursManager = new this.DailyHoursManager();
    let totalMinutes = 0;
    let totalWage = 0;

    this.weekShifts.forEach((shift) => {
      if (shift.startedAt && shift.finishedAt) {
        let shiftDuration = this._getShiftDuration(shift);
        totalMinutes += shiftDuration;

        let locationStartedAt = HospoHero.dateUtils.getDateMomentForLocation(shift.startedAt, shift.relations.locationId);

        totalWage += this._calculateWageForShift(locationStartedAt, shiftDuration);
        dailyHoursManager.addMinutes(locationStartedAt, shiftDuration);
      }
    });

    return {
      wage: HospoHero.misc.rounding(totalWage),
      time: HospoHero.misc.rounding(totalMinutes / 60),
      dailyHours: dailyHoursManager.getHours()
    };
  }
};