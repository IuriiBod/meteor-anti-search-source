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

component.state.actualCost = function() {
  var total = 0;
  var week = getWeekStartEnd(Session.get("thisWeek"), Session.get("thisYear"));
  if(this.type == "sales") {
    var query = {
      "department": "cafe"
    };
    if(week.monday && week.sunday) {
      query = {"date": {$gte: new Date(week.monday).getTime(), $lte: new Date(week.sunday).getTime()}};
    }
    var sales = ActualSales.find(query, {sort: {"date": 1}}).fetch();
    if(sales && sales.length > 0) {
      sales.forEach(function(doc) {
        total += doc.revenue;
      });
    }
  } else if(this.type == "staffCost") {
    var query = {
      "type": null,
      "status": {$ne: "draft"}
    };
    if(week.monday && week.sunday) {
      query = {"shiftDate": {$gte: new Date(week.monday).getTime(), $lte: new Date(week.sunday).getTime()}};
    }
    var shifts = Shifts.find(query, {sort: {"shiftDate": 1}}).fetch();
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
            total += rate * totalhours;
          }
          if(totalmins) {
            total += (rate/60) * totalmins;
          }
        }
      });
    }
  }
  return total;
}

component.state.forecastedCost = function() {
  var total = 0;
  var week = getWeekStartEnd(Session.get("thisWeek"), Session.get("thisYear"));
  if(this.type == "sales") {
    var query = {
      "department": "cafe"
    };
    
    var cursors = [];
    if(week.monday && week.sunday) {
      query = {"date": {$gte: new Date(week.monday).getTime(), $lte: new Date(week.sunday).getTime()}};
    }
    var sales = SalesForecast.find(query, {sort: {"date": 1}}).fetch();
    if(sales && sales.length > 0) {
      sales.forEach(function(doc) {
        total += doc.forecastedRevenue;
      });
    }
  } else if(this.type == "staffCost") {
    var query = {
      "type": null
    };
    if(week.monday && week.sunday) {
      query = {"shiftDate": {$gte: new Date(week.monday).getTime(), $lte: new Date(week.sunday).getTime()}};
    }
    var shifts = Shifts.find(query, {sort: {"shiftDate": 1}}).fetch();
    if(shifts && shifts.length > 0) {
      shifts.forEach(function(shift) {
        var user = Meteor.users.findOne(shift.assignedTo);
        if(user && user.profile && user.profile.payrates) {
          var day = moment(shift.shiftDate).format("dddd");
          var rate = 0;
          var totalhours = 0;
          var totalmins = 0;
          var diff = (shift.endTime - shift.startTime);

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
            total += rate * totalhours;
          }
          if(totalmins) {
            total += (rate/60) * totalmins;
          }
        }
      });
    }
  }
  return total;
}

component.prototype.itemRendered = function() {
  $('[data-toggle="popover"]').popover()
}