StaffCostCalculator = function (weekMonday) {
  this._weekMonday = weekMonday;

  var weekDays = HospoHero.dateUtils.getWeekDays(this._weekMonday);
  var staffCostCb = this._calculateDailyFigures.bind(this);

  this._weekFigures = weekDays.map(staffCostCb);
  this._totalFigures = this._calculateTotalFigures(this._weekFigures);
};


StaffCostCalculator.prototype._getShiftDuration = function (shift, useStartEndTime) {
  var start, end;

  if (useStartEndTime) {
    start = shift.startTime;
    end = shift.endTime;
  } else {
    start = shift.startedAt;
    end = shift.finishedAt;
  }

  var duration = start && end && moment(end).diff(start, 'minutes') || 0;

  // we have problem with clock out dates
  // so, I temporarily limit  shift duration in
  // case if it is longer than 24 hours.
  if (shift.status === 'finished' && !useStartEndTime) {
    if (duration / 60 > 24) {
      duration -= 24;
    }
  }
  return duration;
};


StaffCostCalculator.prototype._calculateShiftCost = function (duration, payRate) {
  return (duration / 60) * payRate;
};


StaffCostCalculator.prototype._calculateStaffFigures = function (date) {
  var dailyShifts = Shifts.find({startTime: TimeRangeQueryBuilder.forDay(date)});

  var staffCost = {
    forecast: 0,
    actual: 0
  };

  var self = this;

  dailyShifts.forEach(function (shift) {
    var user = Meteor.users.findOne({_id: shift.assignedTo});

    if (user) {
      var payRate = HospoHero.misc.getUserPayRate(user, date);

      var actualDuration = self._getShiftDuration(shift, false);
      staffCost.actual += self._calculateShiftCost(actualDuration, payRate);

      var forecastDuration = self._getShiftDuration(shift, true);
      staffCost.forecast += self._calculateShiftCost(forecastDuration, payRate);
    }
  });
  return staffCost;
};


StaffCostCalculator.prototype._calculateSalesFigures = function (date) {
  var dailySales = DailySales.find({date: TimeRangeQueryBuilder.forDay(date)});

  var salesFigures = {
    forecast: 0,
    actual: 0
  };

  var dailyMenuItemSale = function (quantity, price) {
    return _.isNumber(quantity) ? quantity * price : 0;
  };

  dailySales.forEach(function (dailySale) {
    var menuItem = MenuItems.findOne({_id: dailySale.menuItemId});
    if (menuItem && _.isNumber(menuItem.salesPrice)) {
      var itemPrice = menuItem.salesPrice;

      salesFigures.actual += dailyMenuItemSale(dailySale.actualQuantity, itemPrice);
      salesFigures.forecast += dailyMenuItemSale(dailySale.predictionQuantity, itemPrice);
    }
  });

  return salesFigures;
};


StaffCostCalculator.prototype._calculateDailyFigures = function (date) {
  return {
    date: date,
    staff: this._calculateStaffFigures(date),
    sales: this._calculateSalesFigures(date)
  };
};


StaffCostCalculator.prototype._calculateTotalFigures = function (weekFigures) {
  var totalFigures = {
    staff: {
      actual: 0,
      forecast: 0
    },
    sales: {
      actual: 0,
      forecast: 0
    }
  };

  let today = moment();

  weekFigures.forEach(function (dailyFigures) {
    let useForecast = today.isSame(dailyFigures.date, 'day') || today.isBefore(dailyFigures.date);
    let actualStaffProperty = useForecast ? 'forecast' : 'actual';

    totalFigures.sales.forecast += dailyFigures.sales.forecast;
    totalFigures.sales.actual += dailyFigures.sales[actualStaffProperty];

    totalFigures.staff.forecast += dailyFigures.staff.forecast;
    totalFigures.staff.actual += dailyFigures.staff[actualStaffProperty];
  });

  return totalFigures;
};


StaffCostCalculator.prototype.getWeekFigures = function () {
  return this._weekFigures;
};


StaffCostCalculator.prototype.getTotalFigures = function () {
  return this._totalFigures;
};