var component = FlowComponents.define("staffCostTr", function(props) {
  this.dayObj = props.day;
});

component.state.actual = function() {
  var total = 0;
  var self = this;
  var shifts = Shifts.find({"shiftDate": HospoHero.dateUtils.shiftDate(this.dayObj.date), "status": {$ne: "draft"}, "type": null}).fetch();
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
        total += rate * totalhours;
      }
      if(totalmins) {
        total += (rate/60) * totalmins;
      }
    }
  });
  this.set("actualStaffCost", total);
  return total;
}

component.state.forecast = function() {
  var total = 0;
  var self = this;
  var shifts = Shifts.find({"shiftDate": HospoHero.dateUtils.shiftDate(this.dayObj.date), "type": null}).fetch();
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
        total += rate * totalhours;
      }
      if(totalmins) {
        total += (rate/60) * totalmins;
      }
    }
  });
  this.set("forecastedStaffCost", total);
  return total;
}

component.state.class = function() {
  var actual = this.get("actualStaffCost");
  var forecast = this.get("forecastedStaffCost");
  if(actual && forecast) {
    if(actual <= forecast) {
      return "text-info";
    } else {
      return "text-danger";
    }
  }
}