FigureBoxDataHelper = function FigureBoxDataHelper(weekDate) {
  this.weekDate = weekDate;
  this.weekDate.weekRange = HospoHero.dateUtils.getWeekStartEnd(weekDate.week, weekDate.year);

  this.Sales = this._sales();
  this.Staff = this._staffCost();
  this.Wages = {
    actual: this._calcWage("actual"),
    forecasted: this._calcWage("forecasted")
  };
  this.PercentDocs = {
    sales: this._formPercentDoc(this.Sales.actual, this.Sales.forecasted),
    staff: this._formPercentDoc(this.Staff.forecasted, this.Staff.actual),
    wage: this._formPercentDoc(this.Wages.forecasted, this.Wages.actual)
  }
};

//GETTERS
FigureBoxDataHelper.prototype.getSales = function () {
  return this.Sales;
};

FigureBoxDataHelper.prototype.getStaff = function () {
  return this.Staff;
};

FigureBoxDataHelper.prototype.getWages = function () {
  return this.Wages;
};

FigureBoxDataHelper.prototype.getPercentDocs = function () {
  return this.PercentDocs;
};


//PRIVATE FUNCTIONS
FigureBoxDataHelper.prototype._sales = function () {
  var sales = DailySales.find({date: TimeRangeQueryBuilder.forWeek(this.weekDate.weekRange.monday)}, {sort: {"date": 1}}).fetch();
  var actual;
  //ACTUAL SALES
  if (this.weekDate.week != moment().week()) {

    var propName = this.weekDate.week < moment().week() ? 'actualQuantity' : 'predictionQuantity';
    actual = this._calcSalesCost(sales, propName);
    //for current week: past days actual sales and for future dates forecasted sales
  } else {
    var todayActualSale = !!DailySales.findOne({date: TimeRangeQueryBuilder.forDay(moment())});
    var querySeparator = todayActualSale ? moment().endOf('day') : moment().startOf('day');
    var actualSales = DailySales.find({ //ImportedActualSales
      date: {
        $gte: this.weekDate.weekRange.monday,
        $lte: querySeparator.toDate()
      }
    }, {sort: {"date": 1}}).fetch();
    var predictSales = DailySales.find({ //SalesPrediction
      date: {
        $gte: querySeparator.toDate(),
        $lte: this.weekDate.weekRange.sunday
      }
    }, {sort: {date: 1}}).fetch();
    actual = this._calcSalesCost(actualSales, 'actualQuantity') + this._calcSalesCost(predictSales, 'predictionQuantity');
  }

  //FORECASTED SALES
  var forecasted = this._calcSalesCost(sales, 'predictionQuantity');

  return {
    actual: actual,
    forecasted: forecasted
  };
};

FigureBoxDataHelper.prototype._staffCost = function () {
  var finishedShifts = Shifts.find({
    endTime: TimeRangeQueryBuilder.forInterval(this.weekDate.weekRange.monday, new Date()),
    status: 'finished'
  }).fetch();
  var actualStaffCost = this._calcStaffCost(finishedShifts);

  var draftShifts = Shifts.find({
    startTime: TimeRangeQueryBuilder.forInterval(new Date(), this.weekDate.weekRange.sunday),
    status: {$ne: 'finished'}
  }).fetch();
  var forecastedStaffCost = this._calcStaffCost(draftShifts);
  var actual = actualStaffCost + forecastedStaffCost;

  var allShifts = Shifts.find({shiftDate: TimeRangeQueryBuilder.forWeek(this.weekDate.weekRange.monday)}).fetch();

  //PREDICTED STAFF COST
  allShifts = _.map(allShifts, function (item) {
    item.status = "draft";
    return item;
  });
  var forecasted = this._calcStaffCost(allShifts);

  return {
    actual: actual,
    forecasted: forecasted
  }
};

FigureBoxDataHelper.prototype._calcWage = function (type) {
  var wage = 0;
  if (this.Sales[type] != 0) {
    wage = ((this.Staff[type] / this.Sales[type]) * 100);
  }
  return wage;
};

FigureBoxDataHelper.prototype._formPercentDoc = function (declining, subtrahend) {
  var doc = {
    "value": 0,
    "textColor": "text-navy",
    "icon": "fa-angle-up"
  };
  var diff = parseFloat(declining) - parseFloat(subtrahend);
  if (subtrahend != 0) {
    doc.value = ((diff / parseFloat(subtrahend)) * 100);
  }
  doc.value = doc.value.toFixed(2);
  if (diff < 0) {
    doc.textColor = "text-danger";
    doc.icon = "fa-angle-down";
  }
  return doc;
};

FigureBoxDataHelper.prototype._calcSalesCost = function (sales, propertyName) {
  var totalCost = 0;
  if (sales && sales.length > 0 && !!MenuItems.findOne()) {
    _.each(sales, function (item) {
      if (item[propertyName]) {
        var quantity = item[propertyName];
        var price = 0;
        var menuItem = MenuItems.findOne({_id: item.menuItemId});
        if (menuItem && menuItem.salesPrice) {
          price = menuItem.salesPrice;
        }
        totalCost += (quantity ? quantity : 0) * (price ? price : 0);
      }
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
        var totalminutes = self._getTotalMinutes(shift);
        var rate = self._getPayrate(user, shift);
        if (totalminutes > 0) {
          totalCost += (totalminutes / 60) * rate;
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

// I don't know why, but some shifts have startedAt in one day and finishedAt in another
FigureBoxDataHelper.prototype._finishDateFix = function (convertToDate, finishDate) {
  var convertToMoment = moment(convertToDate);
  var convertedMoment = moment(finishDate);
  convertedMoment.set({
    date: convertToMoment.date(),
    month: convertToMoment.month(),
    year: convertToMoment.year()
  });
  return convertedMoment;
};

FigureBoxDataHelper.prototype._getTotalMinutes = function (shift) {
  if (shift.status == 'draft' || shift.status == 'started') {
    return moment(this._finishDateFix(shift.startTime, shift.endTime))
      .diff(moment(shift.startTime), "minutes");
  } else {
    return moment(this._finishDateFix(shift.startedAt, shift.finishedAt))
      .diff(moment(shift.startedAt), "minutes");
  }
};

//DAILY SALES
FigureBoxDataHelper.prototype._getDailyShifts = function (day, isFinished) {
  var statusQeury = isFinished ? 'finished' : {$ne: null};
  return Shifts.find({"shiftDate": TimeRangeQueryBuilder.forDay(day), "status": statusQeury, "type": null}).fetch();
};

FigureBoxDataHelper.prototype.getDailyStaff = function (day) {
  var actualDailyStaff = this._calcStaffCost(this._getDailyShifts(day, true));
  var allShifts = this._getDailyShifts(day, false);
  allShifts = _.map(allShifts, function (item) {
    item.status = "draft";
    return item;
  });
  var forecastedDailyStaff = this._calcStaffCost(allShifts);
  var dailySales = DailySales.find({"date": TimeRangeQueryBuilder.forDay(day)}).fetch();
  var actualSales = this._calcSalesCost(dailySales, "actualQuantity");
  var forecastedSales = this._calcSalesCost(dailySales, "predictionQuantity");
  var actualWage = 0;
  var forecastedWage = 0;

  if (actualSales != 0) {
    actualWage = (actualDailyStaff / actualSales) * 100;
  }
  if (forecastedSales != 0) {
    forecastedWage = (forecastedDailyStaff / forecastedSales) * 100;
  }
  return {
    actual: actualDailyStaff,
    forecasted: forecastedDailyStaff,
    actualWage: actualWage,
    forecastedWage: forecastedWage
  }
};