var component = FlowComponents.define("figureBox", function (props) {
  this.name = props.name;
  this.type = props.type;
  this.subText = props.subtext;
  this.dataContent = props.dataContent;
  this.onRendered(this.itemRendered);

});

component.state.item = function () {
  return this;
};

component.state.currency = function () {
  return !!(this.type == "sales" || this.type == "staffCost");
};

component.state.icon = function () {
  if (this.type == "sales" || this.type == "staffCost") {
    return "$";
  } else if (this.type == "staffCostPercentage") {
    return "%";
  }
};

// TODO: Crying ;-(
component.state.actualCost = function () {
  var total = 0;
  var query;
  var sales;
  var today;
  var todaySalesActual;
  var todaySalesForecast;
  var forecastQuery;
  var forecatsedSales;
  var shifts;
  var allShifts;
  var pastShifts;
  var todayShifts;
  var futureShifts;

  var week = getWeekStartEnd(Session.get("thisWeek"), Session.get("thisYear"));
  if (week.monday && week.sunday) {
    if (this.type == "sales") {

      //for past weeks : actual sales only
      if (Session.get("thisWeek") < moment().week()) {
        sales = ImportedActualSales.find({date: TimeRangeQueryBuilder.forWeek(week.monday)}, {sort: {"date": 1}}).fetch();
        total = calcSalesCost(sales);
        //for current week: past days actual sales and for fututre dates forecasted sales
      } else if (Session.get("thisWeek") == moment().week()) {
        var todayActualSale = !!ImportedActualSales.findOne({date: TimeRangeQueryBuilder.forDay(moment())});
        if (todayActualSale) {
          var querySeparator = moment().endOf("d");
        } else {
          var querySeparator = moment().startOf("d");
        }

        var actualSales = ImportedActualSales.find({
          date: {
            $gte: week.monday,
            $lte: querySeparator.toDate()
          }
        }, {sort: {"date": 1}}).fetch();
        var predictSales = SalesPrediction.find({
          date: {
            $gte: querySeparator.toDate(),
            $lte: week.sunday
          }
        }, {sort: {date: 1}}).fetch();
        total = calcSalesCost(actualSales) + calcSalesCost(predictSales);
        //for future weeks: all forecasted sales
      } else if (Session.get("thisWeek") > moment().week()) {
        sales = SalesPrediction.find({date: TimeRangeQueryBuilder.forWeek(week.monday)}, {sort: {"date": 1}}).fetch();
        total = calcSalesCost(sales);
      }


    } else if (this.type == "staffCost") {
      query = {
        "type": null
      };

      //for past weeks: only finished shifts
      if (Session.get("thisWeek") < moment().week()) {
        if (week.monday && week.sunday) {
          query["status"] = "finished";
          query["shiftDate"] = {$gte: new Date(week.monday).getTime(), $lte: new Date(week.sunday).getTime()};
          shifts = Shifts.find(query, {sort: {"shiftDate": 1}}).fetch();
          total = calcStaffCost(shifts);
        }

        //for current week: for past dates, finished shifts and for future dates, draft and for current date, finished and started
      } else if (Session.get("thisWeek") == moment().week()) {
        today = moment().format("YYYY-MM-DD");
        allShifts = [];

        //past dates: finished shifts
        query['status'] = "finished";
        query["shiftDate"] = {$gte: new Date(week.monday).getTime(), $lt: new Date(today).getTime()};
        pastShifts = Shifts.find(query, {sort: {"shiftDate": 1}}).fetch();
        allShifts = pastShifts;


        //current date: finsihed, draft and started shifts
        delete query.status;
        query["shiftDate"] = new Date(today).getTime();
        todayShifts = Shifts.find(query, {sort: {"shiftDate": 1}}).fetch();
        allShifts = allShifts.concat(todayShifts);

        //future dates, draft shifts
        query['status'] = "draft";
        query["shiftDate"] = {$gt: new Date(today).getTime(), $lt: new Date(week.sunday).getTime()};
        futureShifts = Shifts.find(query, {sort: {"shiftDate": 1}}).fetch();
        allShifts = allShifts.concat(futureShifts);

        total = calcStaffCost(allShifts);

        //for future weeks: all draft shifts
      } else if (Session.get("thisWeek") > moment().week()) {
        if (week.monday && week.sunday) {
          query['status'] = "draft";
          query["shiftDate"] = {$gte: new Date(week.monday).getTime(), $lte: new Date(week.sunday).getTime()};
          shifts = Shifts.find(query, {sort: {"shiftDate": 1}}).fetch();
          total = calcStaffCost(shifts);
        }
      }

    } else if (this.type == "staffCostPercentage") {
      var totalSalesOfWeek = 0;
      var totalWageOfWeek = 0;

      var salesQuery = {
        "department": "cafe"
      };

      var shiftsQuery = {
        "type": null
      };

      //for past weeks
      if (Session.get("thisWeek") < moment().week()) {
        salesQuery["date"] = {$gte: new Date(week.monday).getTime(), $lte: new Date(week.sunday).getTime()};
        sales = ActualSales.find(salesQuery, {sort: {"date": 1}}).fetch();
        totalSalesOfWeek = 0;//calcActualSalesCost(sales);

        shiftsQuery["status"] = {$ne: "draft"};
        shiftsQuery["shiftDate"] = {$gte: new Date(week.monday).getTime(), $lte: new Date(week.sunday).getTime()};
        shifts = Shifts.find(shiftsQuery, {sort: {"shiftDate": 1}}).fetch();
        totalWageOfWeek = calcStaffCost(shifts);

        //for current week
      } else if (Session.get("thisWeek") == moment().week()) {
        //Sales
        total = 0;
        today = moment().format("YYYY-MM-DD");
        salesQuery["date"] = {$gte: new Date(week.monday).getTime(), $lt: new Date(today).getTime()};
        sales = ActualSales.find(salesQuery, {sort: {"date": 1}}).fetch();
        totalSalesOfWeek = 0;//calcActualSalesCost(sales);

        todaySalesActual = ActualSales.findOne({"date": new Date(today).getTime()});
        if (todaySalesActual) {
          totalSalesOfWeek += 0;//calcActualSalesCost([todaySalesActual]);
        } else {
          todaySalesForecast = SalesForecast.findOne({"date": new Date(today).getTime()});
          if (todaySalesForecast) {
            totalSalesOfWeek += 0;//calcForecastedSalesCost([todaySalesForecast]);
          }
        }

        forecastQuery = {
          "department": "cafe",
          "date": {$gt: new Date(today).getTime(), $lte: new Date(week.sunday).getTime()}
        };
        forecatsedSales = SalesForecast.find(forecastQuery, {sort: {"date": 1}}).fetch();
        totalSalesOfWeek += 0;//calcForecastedSalesCost(forecatsedSales);

        //Wages
        allShifts = [];

        //past dates: finished shifts
        shiftsQuery['status'] = "finished";
        shiftsQuery["shiftDate"] = {$gte: new Date(week.monday).getTime(), $lt: new Date(today).getTime()};
        pastShifts = Shifts.find(shiftsQuery, {sort: {"shiftDate": 1}}).fetch();
        allShifts = pastShifts;


        //current date: finsihed, draft and started shifts
        delete shiftsQuery.status;
        shiftsQuery["shiftDate"] = new Date(today).getTime();
        todayShifts = Shifts.find(shiftsQuery, {sort: {"shiftDate": 1}}).fetch();
        allShifts = allShifts.concat(todayShifts);

        //future dates, draft shifts
        shiftsQuery['status'] = "draft";
        shiftsQuery["shiftDate"] = {$gt: new Date(today).getTime(), $lt: new Date(week.sunday).getTime()};
        futureShifts = Shifts.find(shiftsQuery, {sort: {"shiftDate": 1}}).fetch();
        allShifts = allShifts.concat(futureShifts);

        totalWageOfWeek = calcStaffCost(allShifts);


        //for future weeks
      } else if (Session.get("thisWeek") > moment().week()) {
        salesQuery["date"] = {$gte: new Date(week.monday).getTime(), $lte: new Date(week.sunday).getTime()};
        sales = SalesForecast.find(salesQuery, {sort: {"date": 1}}).fetch();
        totalSalesOfWeek = 0;//calcForecastedSalesCost(sales);

        shiftsQuery["status"] = "draft";
        shiftsQuery["shiftDate"] = {$gte: new Date(week.monday).getTime(), $lte: new Date(week.sunday).getTime()};
        shifts = Shifts.find(shiftsQuery, {sort: {"shiftDate": 1}}).fetch();
        totalWageOfWeek = calcStaffCost(shifts);
      }

      var percentage = 0;
      if (totalSalesOfWeek > 0) {
        percentage = (totalWageOfWeek / totalSalesOfWeek);
      }
      total = percentage * 100;
    }
  }
  this.set("actual", total);
  return total;
};

component.state.forecastedCost = function () {
  var total = 0;
  var query;
  var sales;
  var shifts;


  var week = getWeekStartEnd(Session.get("thisWeek"), Session.get("thisYear"));
  if (this.type == "sales") {
    sales = SalesPrediction.find({date: TimeRangeQueryBuilder.forWeek(week.monday)}, {sort: {"date": 1}}).fetch();
    total = calcSalesCost(sales);

  } else if (this.type == "staffCost") {
    query = {
      "type": null
    };
    query["shiftDate"] = {$gte: new Date(week.monday).getTime(), $lte: new Date(week.sunday).getTime()};
    shifts = Shifts.find(query, {sort: {"shiftDate": 1}}).fetch();
    total = calcStaffCost(shifts);

  } else if (this.type == "staffCostPercentage") {
    var totalSalesOfWeek = 0;
    var totalWageOfWeek = 0;

    var salesQuery = {
      "department": "cafe"
    };

    var cursors = [];
    salesQuery["date"] = {$gte: new Date(week.monday).getTime(), $lte: new Date(week.sunday).getTime()};
    sales = SalesForecast.find(salesQuery, {sort: {"date": 1}}).fetch();
    totalSalesOfWeek = 0;//calcForecastedSalesCost(sales);

    query = {
      "type": null
    };
    query["shiftDate"] = {$gte: new Date(week.monday).getTime(), $lte: new Date(week.sunday).getTime()};
    shifts = Shifts.find(query, {sort: {"shiftDate": 1}}).fetch();
    totalWageOfWeek = calcStaffCost(shifts);

    var percentage = 0;
    if (totalSalesOfWeek > 0) {
      percentage = (totalWageOfWeek / totalSalesOfWeek);
    }
    total = percentage * 100;
  }
  this.set("forecasted", total);
  return total;
};

component.state.percent = function () {
  var actual = this.get("actual");
  var forecasted = this.get("forecasted");

  var diff = 0;
  var doc = {
    "value": 0,
    "textColor": "text-navy",
    "icon": "fa-angle-up"
  };

  if (this.type == "sales") {
    diff = parseFloat(actual) - parseFloat(forecasted);
    doc.value = (diff / parseFloat(forecasted)) * 100;
  } else if (this.type == "staffCostPercentage") {
    doc.value = parseFloat(forecasted) - parseFloat(actual);
  } else if (this.type == "staffCost") {
    diff = parseFloat(forecasted) - parseFloat(actual);
    doc.value = (diff / parseFloat(forecasted)) * 100;
  }
  if (diff < 0) {
    doc.textColor = "text-danger";
    doc.icon = "fa-angle-down";
  }
  return doc;
};

component.prototype.itemRendered = function () {
  $('[data-toggle="popover"]').popover()
};

function calcStaffCost(shifts) {
  var totalCost = 0;
  if (shifts && shifts.length > 0) {
    shifts.forEach(function (shift) {
      var user = Meteor.users.findOne(shift.assignedTo);
      if (user && user.profile && user.profile.payrates) {
        var day = moment(shift.shiftDate).format("dddd");
        var rate = 0;
        var totalhours = 0;
        var totalmins = 0;
        var diff = 0;
        if (shift.status == "finished") {
          diff = (shift.finishedAt - shift.startedAt);
        } else if (shift.status == "started") {
          diff = (new Date().getTime() - shift.startedAt);
        } else {
          diff = (shift.endTime - shift.startTime);
        }

        totalhours += moment.duration(diff).hours();
        totalmins += moment.duration(diff).minutes();

        if (totalmins >= 60) {
          totalhours += Math.floor(totalmins / 60);
          totalmins = (totalmins % 60);
        }

        if (day) {
          if (day == "Saturday") {
            if (user.profile.payrates.saturday) {
              rate = user.profile.payrates.saturday;
            }
          } else if (day == "Sunday") {
            if (user.profile.payrates.sunday) {
              rate = user.profile.payrates.sunday;
            }
          } else {
            if (user.profile.payrates.weekdays) {
              rate = user.profile.payrates.weekdays;
            }
          }
        }
        if (totalhours > 0) {
          totalCost += rate * totalhours;
        }
        if (totalmins) {
          totalCost += (rate / 60) * totalmins;
        }
      }
    });
  }
  return totalCost;
}

function calcSalesCost(sales) {
  var totalCost = 0;
  if (sales && sales.length > 0 && !!MenuItems.findOne()) {
    _.each(sales, function (item) {
      var quantity = item.quantity;
      var price = 0;

      var menuItem = MenuItems.findOne({_id: item.menuItemId});
      if(menuItem && menuItem.salesPrice) {
        price = menuItem.salesPrice;
      }

      totalCost += quantity * price;
    });
  }
  return totalCost;
}