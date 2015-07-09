Template.pageHeading.helpers({
  // Route for Home link in breadcrumbs
  home: 'dashboard1'
});

Template.pageHeading.events({
  'click #submitMenuItem': function(event) {
    event.preventDefault();
    Router.go("submitMenuItem");
  },

  'click .subscribeMenuItemBtn': function(event) {
    event.preventDefault();
    var id = Session.get("thisMenuItem");
    Meteor.call("subscribe", id, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  },
  'click .unSubscribeMenuItemBtn': function(event) {
    event.preventDefault();
    var id = Session.get("thisMenuItem");
    Meteor.call("unSubscribe", id, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  },

  'click .copyMenuItemBtn': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    if(id) {
      Meteor.call("duplicateMenuItem", id, function(err, id) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        } else {
          Router.go("menuItemEdit", {"_id": id});
        }
      });
    }
  },

  'click .copyJobItemBtn': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    if(id) {
      Meteor.call("duplicateJobItem", id, function(err, id) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        } else {
          Router.go("jobItemEdit", {"_id": id});
        }
      });
    }
  },

  'click .editMenuItemBtn': function(e) {
    e.preventDefault();
    Router.go("menuItemEdit", {"_id": $(e.target).attr("data-id")})
  },

  'click .printMenuItemBtn': function(event) {
    event.preventDefault();
    print();
  },
  
  'click #submitJobItem': function(event) {
    event.preventDefault();
    Router.go("submitJobItem");
  },

  'click .subscribeJobsList': function(event) {
    event.preventDefault();
    Meteor.call("subscribe", "joblist", function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  },

  'click .unSubscribeJobsList': function(event) {
    event.preventDefault();
    Meteor.call("unSubscribe", "joblist", function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  },

  'click .today': function(event) {
    event.preventDefault();
    var date = moment().format("YYYY-MM-DD");
    Router.go("actualSales", {"date": date});
  },

  'click .previousDay': function(event) {
    event.preventDefault();
    var date = Router.current().params.date;
    var yesterday = moment(date).subtract(1, "days").format("YYYY-MM-DD");
    Router.go("actualSales", {"date": yesterday});
  },

  'click .nextDay': function(event) {
    event.preventDefault();
    var date = Router.current().params.date;
    var tomorrow = moment(date).add(1, "days").format("YYYY-MM-DD")
    Router.go("actualSales", {"date": tomorrow});
  },

  'click .thisWeek': function(event) {
    event.preventDefault();
    var week = moment().format("w");
    var type = $(event.target).closest("div").attr("data-type");
    if(type == "teamHoursReport") {
      var sessionHash = Session.get("reportHash");
      var hash = "shifts";
      if(sessionHash) {
        hash = sessionHash;
      }
      Router.go("teamHours", {"week": week}, {"hash": hash});
    } else if(type == "cafeforecasting") {
      Router.go("cafeSalesForecast", {"week": week});
    } else if(type == "weeklyroster") {
      Router.go("weeklyRoster", {"week": week});
    }
  },

  'click .nextWeek': function(event) {
    event.preventDefault();
    var week = parseInt(Router.current().params.week) + 1;
    var type = $(event.target).closest("div").attr("data-type");
    if(type == "teamHoursReport") {
      var sessionHash = Session.get("reportHash");
      var hash = "shifts";
      if(sessionHash) {
        hash = sessionHash;
      }
      Router.go("teamHours", {"week": week}, {"hash": hash});
    } else if(type == "cafeforecasting") {
      Router.go("cafeSalesForecast", {"week": week});
    } else if(type == "weeklyroster") {
      Router.go("weeklyRoster", {"week": week});
    }
  },

  'click .previousWeek': function(event) {
    event.preventDefault();
    var week = parseInt(Router.current().params.week) - 1;
    var type = $(event.target).closest("div").attr("data-type");
    if(type == "teamHoursReport") {
      var sessionHash = Session.get("reportHash");
      var hash = "shifts";
      if(sessionHash) {
        hash = sessionHash;
      }
      Router.go("teamHours", {"week": week}, {"hash": hash});
    } else if(type == "cafeforecasting") {
      Router.go("cafeSalesForecast", {"week": week});
    } else if(type == "weeklyroster") {
      Router.go("weeklyRoster", {"week": week});
    }
  },

  'click .todayRoster': function(event) {
    event.preventDefault();
    var date = moment().format("YYYY-MM-DD");
    Router.go("dailyRoster", {"date": date});
  },

  'click .prevDayRoster': function(event) {
    event.preventDefault();
    var date = Router.current().params.date;
    var yesterday = moment(date).subtract(1, "days").format("YYYY-MM-DD");
    Router.go("dailyRoster", {"date": yesterday});
  },

  'click .nextDayRoster': function(event) {
    event.preventDefault();
    var date = Router.current().params.date;
    var tomorrow = moment(date).add(1, "days").format("YYYY-MM-DD")
    Router.go("dailyRoster", {"date": tomorrow});
  },

  'click #publishRoster': function(event) {
    event.preventDefault();
    var weekNo = Session.get("thisWeek");
    var week = getDatesFromWeekNumber(parseInt(weekNo));
    var dates = [];
    week.forEach(function(day) {
      if(day && day.date) {
        dates.push(new Date(day.date).getTime())
      }
    });
    var shifts = Shifts.find({"shiftDate": {$in: dates}, "published": false, "assignedTo": {$ne: null}}).fetch();
    var tobePublished = [];
    var users = [];
    if(shifts.length > 0) {
      shifts.forEach(function(shift) {
        tobePublished.push(shift._id);
        users.push(shift.assignedTo);
      });
    }

    if(tobePublished.length > 0) {
      Meteor.call("publishRoster", weekNo, tobePublished, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        } 
        var weekItem = "publishedOn-"+ Session.get("thisWeek");
        localStorage.setItem(weekItem, new Date().getTime());
      });
      users.forEach(function(user) {
        var to = Meteor.users.findOne(user);
        var weekStart = moment(dates[0]).format("YYYY-MM-DD");
        var title = "Weekly roster for the week starting from " + weekStart + " published";
        var text = "<br>";
        var open = "<br>";
        var shiftsPublished = Shifts.find({
          "assignedTo": user,
          "shiftDate": {$gte: dates[0], $lte: dates[6]}
        }).fetch();
        var openShifts = Shifts.find({
          "assignedTo": null,
          "shiftDate": {$gte: dates[0], $lte: dates[6]}
        }).fetch();
        if(shiftsPublished && openShifts) {
          if(shiftsPublished.length > 0) {
            shiftsPublished.forEach(function(shift) {
              var start =  moment(shift.startTime).format("hh:mm A");
              var end = moment(shift.endTime).format("hh:mm A");
              text += "<a href='" + Meteor.absoluteUrl() + "roster/shift/" + shift._id + "'>" + moment(shift.shiftDate).format("ddd, Do MMMM") + " shift from " + start + " - " + end + "</a>.<br>";
            });
          }

          if(openShifts.length > 0) {
            openShifts.forEach(function(shift) {
              var start =  moment(shift.startTime).format("hh:mm A");
              var end = moment(shift.endTime).format("hh:mm A");
              open += "<a href='" + Meteor.absoluteUrl() + "roster/shift/" + shift._id + "'>" + moment(shift.shiftDate).format("ddd, Do MMMM") + " shift from " + start + " - " + end + "</a>.<br>";
            });
          }

          var to = {
            "_id": to._id,
            "email": to.emails[0].address,
            "name": to.username
          }

          var info = {
            "title": title, 
            "text": text, 
            "startDate": weekStart,
            "openShifts": open,
            "week": weekNo
          }
          Meteor.call("notifyRoster", to, info, function(err) {
            if(err) {
              console.log(err);
              return alert(err.reason);
            } 
          });
        }
      });
    }
  }
});