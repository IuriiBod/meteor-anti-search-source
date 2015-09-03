var component = FlowComponents.define("figureBox", function(props) {
  this.name = props.name;
  this.type = props.type;
  this.subText = props.subtext;
  this.dataContent = props.dataContent;
  this.onRendered(this.itemRendered);

});

component.state.item = function() {
  return this;
}

component.state.currency = function() {
  if(this.type == "sales" || this.type == "staffCost") {
    return true;
  } else {
    return false;
  }
}

component.state.icon = function() {
  if(this.type == "sales" || this.type == "staffCost") {
    return "$";
  } else if(this.type == "staffCostPercentage") {
    return "%";
  }
}

component.state.actualCost = function() {
  var total = 0;
  var week = getWeekStartEnd(Session.get("thisWeek"), Session.get("thisYear"));
  if(week.monday && week.sunday) {
    if(this.type == "sales") {
      var query = {
        "department": "cafe"
      };

      //for past weeks : actual sales only
      if(Session.get("thisWeek") < moment().week()) {
        query["date"] = {$gte: new Date(week.monday).getTime(), $lte: new Date(week.sunday).getTime()};
        var sales = ActualSales.find(query, {sort: {"date": 1}}).fetch();
        total = calcActualSalesCost(sales);
        //for current week: past days actual sales and for fututre dates forecasted sales
      } else if(Session.get("thisWeek") == moment().week()) {
        var total = 0;
        var today = moment().format("YYYY-MM-DD");
        query["date"] = {$gte: new Date(week.monday).getTime(), $lt: new Date(today).getTime()};
        var sales = ActualSales.find(query, {sort: {"date": 1}}).fetch();
        total = calcActualSalesCost(sales);
        
        var todaySalesActual = ActualSales.findOne({"date": new Date(today).getTime()});
        if(todaySalesActual) {
          total += calcActualSalesCost([todaySalesActual]);
        } else {
          var todaySalesForecast = SalesForecast.findOne({"date": new Date(today).getTime()});
          if(todaySalesForecast) {
            total += calcForecastedSalesCost([todaySalesForecast]);
          }
        }

        var forecastQuery = {
          "department": "cafe",
          "date": {$gt: new Date(today).getTime(), $lte: new Date(week.sunday).getTime()}
        }
        var forecatsedSales = SalesForecast.find(forecastQuery, {sort: {"date": 1}}).fetch();
        total += calcForecastedSalesCost(forecatsedSales);

        //for future weeks: all forecasted sales
      } else if(Session.get("thisWeek") > moment().week()) {
        var total = 0;
        query["date"] = {$gte: new Date(week.monday).getTime(), $lte: new Date(week.sunday).getTime()};
        var sales = SalesForecast.find(query, {sort: {"date": 1}}).fetch();
        total = calcActualSalesCost(sales);
      }


    } else if(this.type == "staffCost") {
      var query = {
        "type": null,
      };

      //for past weeks: only finished shifts
      if(Session.get("thisWeek") < moment().week()) {
        if(week.monday && week.sunday) {
          query["status"] = "finished";
          query["shiftDate"] = {$gte: new Date(week.monday).getTime(), $lte: new Date(week.sunday).getTime()};
          var shifts = Shifts.find(query, {sort: {"shiftDate": 1}}).fetch();
          total = calcStaffCost(shifts);
        }

        //for current week: for past dates, finished shifts and for future dates, draft and for current date, finished and started
      } else if (Session.get("thisWeek") == moment().week()) {
        var today = moment().format("YYYY-MM-DD");
        var allShifts = [];

        //past dates: finished shifts
        query['status'] = "finished";
        query["shiftDate"] = {$gte: new Date(week.monday).getTime(), $lt: new Date(today).getTime()};
        var pastShifts = Shifts.find(query, {sort: {"shiftDate": 1}}).fetch();        
        allShifts = pastShifts;

        
        //current date: finsihed, draft and started shifts
        delete query.status;
        query["shiftDate"] = new Date(today).getTime();
        var todayShifts = Shifts.find(query, {sort: {"shiftDate": 1}}).fetch();
        allShifts = allShifts.concat(todayShifts);

        //future dates, draft shifts
        query['status'] = "draft";
        query["shiftDate"] = {$gt: new Date(today).getTime(), $lt: new Date(week.sunday).getTime()};
        var futureShifts = Shifts.find(query, {sort: {"shiftDate": 1}}).fetch();
        allShifts = allShifts.concat(futureShifts);
      
        total = calcStaffCost(allShifts);

        //for future weeks: all draft shifts
      } else if (Session.get("thisWeek") > moment().week()) {
        if(week.monday && week.sunday) {
          query['status'] = "draft";
          query["shiftDate"] = {$gte: new Date(week.monday).getTime(), $lte: new Date(week.sunday).getTime()};
          var shifts = Shifts.find(query, {sort: {"shiftDate": 1}}).fetch();
          total = calcStaffCost(shifts);
        }
      }
      
    } else if(this.type == "staffCostPercentage") {
      var totalSalesOfWeek = 0;
      var totalWageOfWeek = 0;
      
      var salesQuery = {
        "department": "cafe"
      };

      var shiftsQuery = {
        "type": null,
      };

      //for past weeks
      if(Session.get("thisWeek") < moment().week()) {
        salesQuery["date"] = {$gte: new Date(week.monday).getTime(), $lte: new Date(week.sunday).getTime()};
        var sales = ActualSales.find(salesQuery, {sort: {"date": 1}}).fetch();
        totalSalesOfWeek = calcActualSalesCost(sales);

        shiftsQuery["status"] = {$ne: "draft"};
        shiftsQuery["shiftDate"] = {$gte: new Date(week.monday).getTime(), $lte: new Date(week.sunday).getTime()};
        var shifts = Shifts.find(shiftsQuery, {sort: {"shiftDate": 1}}).fetch();
        totalWageOfWeek = calcStaffCost(shifts);
        
      //for current week
      } else if (Session.get("thisWeek") == moment().week()) {
        //Sales
        var total = 0;
        var today = moment().format("YYYY-MM-DD");
        salesQuery["date"] = {$gte: new Date(week.monday).getTime(), $lt: new Date(today).getTime()};
        var sales = ActualSales.find(salesQuery, {sort: {"date": 1}}).fetch();
        totalSalesOfWeek = calcActualSalesCost(sales);
        
        var todaySalesActual = ActualSales.findOne({"date": new Date(today).getTime()});
        if(todaySalesActual) {
          totalSalesOfWeek += calcActualSalesCost([todaySalesActual]);
        } else {
          var todaySalesForecast = SalesForecast.findOne({"date": new Date(today).getTime()});
          if(todaySalesForecast) {
            totalSalesOfWeek += calcForecastedSalesCost([todaySalesForecast]);
          }
        }

        var forecastQuery = {
          "department": "cafe",
          "date": {$gt: new Date(today).getTime(), $lte: new Date(week.sunday).getTime()}
        }
        var forecatsedSales = SalesForecast.find(forecastQuery, {sort: {"date": 1}}).fetch();
        totalSalesOfWeek += calcForecastedSalesCost(forecatsedSales);

        //Wages
        var allShifts = [];

        //past dates: finished shifts
        shiftsQuery['status'] = "finished";
        shiftsQuery["shiftDate"] = {$gte: new Date(week.monday).getTime(), $lt: new Date(today).getTime()};
        var pastShifts = Shifts.find(shiftsQuery, {sort: {"shiftDate": 1}}).fetch();        
        allShifts = pastShifts;

        
        //current date: finsihed, draft and started shifts
        delete shiftsQuery.status;
        shiftsQuery["shiftDate"] = new Date(today).getTime();
        var todayShifts = Shifts.find(shiftsQuery, {sort: {"shiftDate": 1}}).fetch();
        allShifts = allShifts.concat(todayShifts);

        //future dates, draft shifts
        shiftsQuery['status'] = "draft";
        shiftsQuery["shiftDate"] = {$gt: new Date(today).getTime(), $lt: new Date(week.sunday).getTime()};
        var futureShifts = Shifts.find(shiftsQuery, {sort: {"shiftDate": 1}}).fetch();
        allShifts = allShifts.concat(futureShifts);
      
        totalWageOfWeek = calcStaffCost(allShifts);
        

      //for future weeks
      } else if (Session.get("thisWeek") > moment().week()) {
        salesQuery["date"] = {$gte: new Date(week.monday).getTime(), $lte: new Date(week.sunday).getTime()};
        var sales = SalesForecast.find(salesQuery, {sort: {"date": 1}}).fetch();
        totalSalesOfWeek = calcForecastedSalesCost(sales);

        shiftsQuery["status"] = "draft";
        shiftsQuery["shiftDate"] = {$gte: new Date(week.monday).getTime(), $lte: new Date(week.sunday).getTime()};
        var shifts = Shifts.find(shiftsQuery, {sort: {"shiftDate": 1}}).fetch();
        totalWageOfWeek = calcStaffCost(shifts);
      }

      var percentage = 0;
      if(totalSalesOfWeek > 0) {
        percentage = (totalWageOfWeek/totalSalesOfWeek);
      }
      total = percentage * 100;
    }
  }
  this.set("actual", total)
  return total;
}

component.state.forecastedCost = function() {
  var total = 0;
  var week = getWeekStartEnd(Session.get("thisWeek"), Session.get("thisYear"));
  if(this.type == "sales") {
    var query = {
      "department": "cafe",
      "date": {$gte: new Date(week.monday).getTime(), $lte: new Date(week.sunday).getTime()}
    };
  
    var sales = SalesForecast.find(query, {sort: {"date": 1}}).fetch();
    total = calcForecastedSalesCost(sales);

  } else if(this.type == "staffCost") {
    var query = {
      "type": null
    };
    query["shiftDate"] = {$gte: new Date(week.monday).getTime(), $lte: new Date(week.sunday).getTime()};
    var shifts = Shifts.find(query, {sort: {"shiftDate": 1}}).fetch();
    total = calcStaffCost(shifts);
    
  } else if(this.type == "staffCostPercentage") {
    var totalSalesOfWeek = 0;
    var totalWageOfWeek = 0;

    var salesQuery = {
      "department": "cafe"
    };
    
    var cursors = [];
    salesQuery["date"] = {$gte: new Date(week.monday).getTime(), $lte: new Date(week.sunday).getTime()};
    var sales = SalesForecast.find(salesQuery, {sort: {"date": 1}}).fetch();
    totalSalesOfWeek = calcForecastedSalesCost(sales);

    var query = {
      "type": null
    };
    query["shiftDate"] = {$gte: new Date(week.monday).getTime(), $lte: new Date(week.sunday).getTime()};
    var shifts = Shifts.find(query, {sort: {"shiftDate": 1}}).fetch();
    totalWageOfWeek = calcStaffCost(shifts);

    var percentage = 0;
    if(totalSalesOfWeek > 0) {
      percentage = (totalWageOfWeek/totalSalesOfWeek);
    }
    total = percentage * 100;
  }
  this.set("forecasted", total)
  return total;
}

component.state.percent = function() {
  var actual = this.get("actual");
  var forecasted = this.get("forecasted");

  var diff = parseFloat(actual) - parseFloat(forecasted);
  var doc = {
    "value": 0,
    "textColor": "text-navy",
    "icon": "fa-angle-up"
  }

  if(this.type == "sales" || this.type == "staffCost") {
    doc.value = (diff/parseFloat(forecasted)) * 100;
  } else if(this.type == "staffCostPercentage") {
    doc.value = diff;
  }
  if(diff < 0) {
    doc.textColor = "text-danger";
    doc.icon = "fa-angle-down";
  }
  return doc;
}

component.prototype.itemRendered = function() {
  $('[data-toggle="popover"]').popover()
}

function calcStaffCost(shifts) {
  var totalCost = 0;
  if(shifts && shifts.length > 0) {
    shifts.forEach(function(shift) {
      var user = Meteor.users.findOne(shift.assignedTo);
      if(user && user.profile && user.profile.payrates) {
        var day = moment(shift.shiftDate).format("dddd");
        var rate = 0;
        var totalhours = 0;
        var totalmins = 0;
        var diff = 0;
        if(shift.status == "finished") {
          diff = (shift.finishedAt - shift.startedAt);
        } else if(shift.status == "started") {
          diff =  (new Date().getTime() - shift.startedAt);
        } else {
          diff = (shift.endTime - shift.startTime);
        }

        totalhours += moment.duration(diff).hours();
        totalmins += moment.duration(diff).minutes();

        if(totalmins >= 60) {
          totalhours +=  Math.floor(totalmins/60);
          totalmins = (totalmins%60);
        }

        if(day ) {
          if(day == "Saturday") {
            if(user.profile.payrates.saturday) {
              rate = user.profile.payrates.saturday;
            }
          } else if(day == "Sunday") {
            if(user.profile.payrates.sunday) {
              rate = user.profile.payrates.sunday;
            }
          } else {
            if(user.profile.payrates.weekdays) {
              rate = user.profile.payrates.weekdays;
            }
          }
        }
        if(totalhours > 0) {
          totalCost += rate * totalhours;
        }
        if(totalmins) {
          totalCost += (rate/60) * totalmins;
        }
      }
    });
  }
  return totalCost;
}

function calcActualSalesCost(sales) {
  var totalCost = 0;
  if(sales && sales.length > 0) {
    sales.forEach(function(doc) {
      totalCost += doc.revenue;
    });
  }
  return totalCost;
}

function calcForecastedSalesCost(forecatsedSales) {
  var totalCost = 0;
  if(forecatsedSales && forecatsedSales.length > 0) {
    forecatsedSales.forEach(function(doc) {
      totalCost += doc.forecastedRevenue;
    });
  }
  return totalCost;
}