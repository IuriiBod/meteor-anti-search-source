var component = FlowComponents.define("staffCostPercentagesTr", function(props) {
  this.dayObj = props.day;
});

component.state.actual = function() {
  var self = this;
  var wages = 0;
  var sales = 0;

  var shifts = Shifts.find({"shiftDate": new Date(self.dayObj.date).getTime(), "status": {$ne: "draft"}, "type": null}).fetch();
  shifts.forEach(function(shift) {
    var user = Meteor.users.findOne(shift.assignedTo);
    if(user && user.profile && user.profile.payrates) {
      var day = moment(self.dayObj.date).format("dddd");
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
        wages += rate * totalhours;
      }
      if(totalmins) {
        wages += (rate/60) * totalmins;
      }
    }
  });
  
  var actualSales = ActualSales.findOne({"date": new Date(self.dayObj.date).getTime(), "department": "cafe"});
  if(actualSales) {
    sales = actualSales.revenue;
  }

  var percentage = 0;
  if(sales > 0) {
    percentage = (wages/sales);
  }
  percentage = percentage * 100;
  this.set("actualStaffCostPercentage", percentage);
  return percentage;
}

component.state.forecast = function() {
  var self = this;
  var wages = 0;
  var sales = 0;

  var shifts = Shifts.find({"shiftDate": new Date(self.dayObj.date).getTime(), "type": null}).fetch();
  shifts.forEach(function(shift) {
    var user = Meteor.users.findOne(shift.assignedTo);
    if(user && user.profile && user.profile.payrates) {
      var day = moment(self.dayObj.date).format("dddd");
      var rate = 0;
      var totalhours = 0;
      var totalmins = 0;
      var diff = 0;
      diff = (shift.endTime - shift.startTime);

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
        wages += rate * totalhours;
      }
      if(totalmins) {
        wages += (rate/60) * totalmins;
      }
    }
  });
  
  var forecastesSales = SalesForecast.findOne({"date": new Date(self.dayObj.date).getTime(), "department": "cafe"});
  if(forecastesSales) {
    sales = forecastesSales.forecastedRevenue;
  }

  var percentage = 0;
  if(sales > 0) {
    percentage = (wages/sales);
  }
  percentage = percentage * 100;
  this.set("forecastedStaffCostPercentage", percentage);
  return percentage;
}

component.state.class = function() {
  var actual = this.get("actualStaffCostPercentage");
  var forecast = this.get("forecastedStaffCostPercentage");
  if(actual && forecast) {
    if(actual <= forecast) {
      return "text-info";
    } else {
      return "text-danger";
    }
  }
}