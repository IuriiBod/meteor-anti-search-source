FigureBoxDataHelper = function FigureBoxDataHelper(data) {
  this.data = data;
  if (data.week && data.year) {
    this.data.weekRange = HospoHero.dateUtils.getWeekStartEnd(data.week, data.year);
    this.sales = DailySales.find({date: TimeRangeQueryBuilder.forWeek(this.data.weekRange.monday)}, {sort: {"date": 1}}).fetch();
    this.shifts = Shifts.find({shiftDate: TimeRangeQueryBuilder.forWeek(this.data.weekRange.monday)}).fetch();
    this.daySales = DailySales.find({"date": TimeRangeQueryBuilder.forDay(this.data)}).fetch();
  }

};

FigureBoxDataHelper.prototype.getWeeklySale = function () {
  if (this.data.week != moment().week()) {
    var sales = this.sales;
    var propName = this.data.week < moment().week() ? 'actualQuantity' : 'predictionQuantity';
    return this._calcSalesCost(sales, propName);
    //for current week: past days actual sales and for future dates forecasted sales
  } else {
    var todayActualSale = !!DailySales.findOne({date: TimeRangeQueryBuilder.forDay(moment())});
    var querySeparator = todayActualSale ? moment().endOf('day') : moment().startOf('day');
    var actualSales = DailySales.find({ //ImportedActualSales
      date: {
        $gte: this.data.weekRange.monday,
        $lte: querySeparator.toDate()
      }
    }, {sort: {"date": 1}}).fetch();
    var predictSales = DailySales.find({ //SalesPrediction
      date: {
        $gte: querySeparator.toDate(),
        $lte: this.data.weekRange.sunday
      }
    }, {sort: {date: 1}}).fetch();
    return this._calcSalesCost(actualSales, 'actualQuantity') + this._calcSalesCost(predictSales, 'predictionQuantity');
  }
};

FigureBoxDataHelper.prototype.getForecastedSales = function () {
  var sales = this.sales;
  return this._calcSalesCost(sales, 'predictionQuantity');
};

FigureBoxDataHelper.prototype.getWeeklyStaffCost = function () {
  return this._calcStaffCost(this.shifts);
};

FigureBoxDataHelper.prototype.getRosteredStaffCost = function () {
  var shifts = _.map(this.shifts, function (item) {
    item.status = "draft";
    return item;
  });
  return this._calcStaffCost(shifts);
};

FigureBoxDataHelper.prototype.getDailyActual = function () {
  var shifts = this._getShifts("draft");
  return {
    actualWages: this._calcStaffCost(shifts),
    actualSales: this._calcSalesCost(this.daySales, 'actualQuantity')
  }
};

FigureBoxDataHelper.prototype.getDailyForecast = function () {
  var shifts = this._getShifts("finished");
  return {
    forecastedWages: this._calcStaffCost(shifts),
    forecastedSales: this._calcSalesCost(this.daySales, 'predictionQuantity')
  }
};

FigureBoxDataHelper.prototype.percent = function () {
  if (this.data.declining && this.data.subtrahend) {
    var doc = {
      "value": 0,
      "textColor": "text-navy",
      "icon": "fa-angle-up"
    };
    var diff = parseFloat(this.data.declining) - parseFloat(this.data.subtrahend);
    doc.value = ((diff / parseFloat(this.data.subtrahend)) * 100);
    doc.value = !isNaN(doc.value) ? doc.value.toFixed(2) : 0;
    if (diff < 0) {
      doc.textColor = "text-danger";
      doc.icon = "fa-angle-down";
    }
    return doc;
  }
};

FigureBoxDataHelper.prototype._calcSalesCost = function (sales, propertyName) {
  var totalCost = 0;
  if (sales && sales.length > 0 && !!MenuItems.findOne()) {
    _.each(sales, function (item) {
      var quantity = item[propertyName];
      var price = 0;
      var menuItem = MenuItems.findOne({_id: item.menuItemId});
      if (menuItem && menuItem.salesPrice) {
        price = menuItem.salesPrice;
      }
      totalCost += (quantity ? quantity : 0) * (price ? price : 0);
    });
  }
  return totalCost;
};

FigureBoxDataHelper.prototype._calcStaffCost = function (shifts) {
  var self = this;
  var totalCost = 0;
  if (shifts && shifts.length > 0) {
    _.each(shifts, function (shift) {
      var user = Meteor.users.findOne({_id: shift.assignedTo});
      if (user && user.profile && user.profile.payrates) {
        var totalhours = self._getTotalHours(shift);
        var rate = self._getPayrate(user, shift);
        if (totalhours > 0) {
          totalCost += rate * totalhours;
        }
      }
    });
  }
  return totalCost;
};

FigureBoxDataHelper.prototype._getPayrate = function (user, shift) {
  var day = moment(shift.shiftDate).format("dddd");
  if (day) {
    if (day === "Saturday") {
      if (user.profile.payrates.saturday) {
        return user.profile.payrates.saturday;
      }
    } else if (day === "Sunday") {
      if (user.profile.payrates.sunday) {
        return user.profile.payrates.sunday;
      }
    } else {
      if (user.profile.payrates.weekdays) {
        return user.profile.payrates.weekdays;
      }
    }
  }
  return 0;
};

FigureBoxDataHelper.prototype._getTotalHours = function (shift) {
  if (shift.status == "draft" || shift.status == "started") {
    return moment(shift.endTime).diff(moment(shift.startTime), "hour");
  } else {
    return moment(shift.finishedAt).diff(moment(shift.startedAt), "hour");
  }
};

FigureBoxDataHelper.prototype._getShifts = function (exept) {
  return Shifts.find({"shiftDate": TimeRangeQueryBuilder.forDay(this.data), "status": {$ne: exept}, "type": null}).fetch();
};