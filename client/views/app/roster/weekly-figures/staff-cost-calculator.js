console.log('debug here');


StaffCostCalculator = function (weekMonday) {
  this._weekMonday = weekMonday;

  var weekDays = HospoHero.dateUtils.getWeekDays(this._weekMonday);
  var staffCostCb = this._calculateDailyFigures.bind(this);

  this._weekFigures = weekDays.map(staffCostCb);
  this._totalFigures = this._calculateTotalFigures(this._weekFigures);
};


StaffCostCalculator.prototype._getShiftDuration = function (shift, isForceStartEndTime) {
  var start, end;
  if (shift.status === 'finished' && !isForceStartEndTime) {
    start = shift.startedAt;
    end = shift.finishedAt;
  } else {
    start = shift.startTime;
    end = shift.endTime;
  }
  return moment(end).diff(start, 'minutes');
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

      staffCost.actual += self._calculateShiftCost(self._getShiftDuration(shift, false), payRate);
      staffCost.forecast += self._calculateShiftCost(self._getShiftDuration(shift, true), payRate);
    } else {
      console.log('user not found', shift.assignedTo);
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

  weekFigures.forEach(function (dailyFigures) {
    var sumFigures = function (propertyName) {
      totalFigures[propertyName].actual += dailyFigures[propertyName].actual;
      totalFigures[propertyName].forecast += dailyFigures[propertyName].forecast;
    };

    sumFigures('staff');
    sumFigures('sales');
  });

  return totalFigures;
};


StaffCostCalculator.prototype.getWeekFigures = function () {
  return this._weekFigures;
};


StaffCostCalculator.prototype.getTotalFigures = function () {
  return this._totalFigures;
};