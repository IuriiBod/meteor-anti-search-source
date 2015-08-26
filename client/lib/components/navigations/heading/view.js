Template.pageHeading.events({
  'click .breadcrumbCategory': function(event) {
    event.preventDefault();
    var category = $(event.target).attr("data-category");
    if(category == "Jobs") {
      Router.go("jobItemsMaster");
    } else if(category == "Menus") {
      Router.go("menuItemsMaster", {"category": Session.get("category"), "status": Session.get("status")});
    } else if(category == "Settings") {
      Router.go("admin");
    } else if(category == "Stocktake List") {
      Router.go("stocktakeList");
    }
  },

  'click .breadcrumbSubCategory': function(event) {
    event.preventDefault();
    var category = $(event.target).attr("data-category");
    var id = $(event.target).attr("data-id");
    if(category == "Jobs") {
      Router.go("jobItemDetailed", {"_id": id});
    } else if(category == "Menus") {
      Router.go("menuItemDetail", {"_id": id});
    }
  },

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
          Router.go("menuItemDetail", {"_id": id});
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
  
  'click .deleteMenuItemBtn': function(e) {
    e.preventDefault();
    var result = confirm("Are you sure, you want to delete this menu ?");
    if(result) {
      var id = $(event.target).attr("data-id");
      var item = MenuItems.findOne(id);
      
      if(id) {
        Meteor.call("deleteMenuItem", id, function(err) {
          if(err) {
            console.log(err);
            return alert(err.reason);
          } else {
             var options = {
              "type": "delete",
              "title": "Menu " + item.name + " has been deleted",
              "time": Date.now()
            }
            Meteor.call("sendNotifications", id, "menu", options, function(err) {
              if(err) {
                console.log(err);
                return alert(err.reason);
              }
            });
            Router.go("menuItemsMaster", {"category": "all", "status": "all"});
          }
        });
      }
    }
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
    } else if(type == "currentStocksReport") {
      Router.go("currentStocks", {"week": week});
    }
  },

  'click .nextWeek': function(event) {
    event.preventDefault();
    var type = $(event.target).closest("div.title-action").attr("data-type");
    if(type == "weeklyroster") {
      var year = parseInt(Router.current().params.year);
      var weeksNum = moment(year+"-12-31").format("w");
      weeksNum = (weeksNum == 1) ? moment(year+"-12-24").format("w") : weeksNum;
      var week = parseInt(Router.current().params.week) + 1;
    
      if (week > weeksNum) {
        week = week%weeksNum;
        year ++;
      }
    } else {
      var week = parseInt(Router.current().params.week) + 1;
    }
    var a = new Date(year.toString());
    var date = moment(a).week(week).format("YYYY-MM-DD");    
    Session.set("thisWeek", week);
    Session.set("checkedDate", new Date(date));
    
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
      Router.go("weeklyRoster", {"year": year, "week": week});
    } else if(type == "currentStocksReport") {
      Router.go("currentStocks", {"week": week});
    }
  },

  'click .previousWeek': function(event) {
    event.preventDefault();
    var type = $(event.target).closest("div.title-action").attr("data-type");

    if(type == "weeklyroster") {
      var year = parseInt(Router.current().params.year);
      var weeksNum = moment(year+"-12-31").format("w");
      weeksNum = (weeksNum == 1) ? moment(year+"-12-24").format("w") : weeksNum;
      var week = parseInt(Router.current().params.week) - 1;
    
      if (week < 1) {
        week = weeksNum;
        year --;
      }
    } else {
      var week = parseInt(Router.current().params.week) - 1;
    }
    
    var a = new Date(year.toString());
    var date = moment(a).week(week).format("YYYY-MM-DD");    
    Session.set("thisWeek", week);
    Session.set("checkedDate", new Date(date));
    
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
      Router.go("weeklyRoster", {"year": year, "week": week});
    } else if(type == "currentStocksReport") {
      Router.go("currentStocks", {"week": week});
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
    var shifts = Shifts.find({"shiftDate": {$in: dates}, "published": false, "type": null}).fetch();
    var tobePublished = [];
    var users = [];
    if(shifts.length > 0) {
      shifts.forEach(function(shift) {
        tobePublished.push(shift._id);
        if(users.indexOf(shift.assignedTo) < 0) {
          users.push(shift.assignedTo);
        }
      });
    }
    if(tobePublished.length > 0) {
      Meteor.call("publishRoster", weekNo, tobePublished, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
      users.forEach(function(user) {
        var to = Meteor.users.findOne(user);
        if(to) {
          var weekStart = moment(dates[0]).format("dddd, Do MMMM YYYY");
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

            var info = {
              "title": title,
              "text": text,
              "startDate": weekStart,
              "week": weekNo
            }
            if(openShifts.length > 0) {
              openShifts.forEach(function(shift) {
                var start =  moment(shift.startTime).format("hh:mm A");
                var end = moment(shift.endTime).format("hh:mm A");
                open += "<a href='" + Meteor.absoluteUrl() + "roster/shift/" + shift._id + "'>" + moment(shift.shiftDate).format("ddd, Do MMMM") + " shift from " + start + " - " + end + "</a>.<br>";
              });
              info.openShifts = open;
            }

            var to = {
              "_id": to._id,
              "email": to.emails[0].address,
              "name": to.username
            }

            Meteor.call("notifyRoster", to, info, function(err) {
              if(err) {
                console.log(err);
                return alert(err.reason);
              }
            });
          }
        }
      });
    }
  },

  'click #startNewStocktake': function(event) {
    event.preventDefault();
    var date = moment().format("YYYY-MM-DD");
    var stocktake = StocktakeMain.findOne({"stocktakeDate": new Date(date).getTime()});
    if(stocktake) {
      $("#newStocktakeModal").modal();
    } else {
      Meteor.call("createMainStocktake", date, function(err, id) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        } else {
          Router.go("stocktakeCounting", {"_id": id});
        }
      });
    }
  },
  'changeDate .datepicker': function(e, tpl) {
    var date = e.date;
    var week = moment(date).week();
    var year = moment(date).format("YYYY");
    Session.set("week", week);    
    tpl.$(".datepicker").datepicker("remove");

    tpl.$(".datepicker").datepicker({
      calendarWeeks: true
    });

    var checkedDate = new Date(year, date.getMonth(), date.getDate());
    Session.set("checkedDate", checkedDate);
    tpl.$(".datepicker").datepicker("update", checkedDate);
    Router.go("weeklyRoster", {"year": year, "week": week});
  },
  'click .calendar-toggle': function(e, tpl) {


    if ($(e.target).parent().hasClass("open")) {
      $(".day.active").removeClass("week");
      tpl.$(".datepicker").datepicker("hide");
    } else {
      $(".day.active").siblings(".day").addClass("week");
      tpl.$(".datepicker").datepicker("show");
    }
  }
});

Template.pageHeading.rendered = function() {
  var checkedDate = Session.get("checkedDate");
  if (!checkedDate) {
    var checkedDate = new Date();
    var week = moment().format("w");
    Session.set("thisWeek", week);
    Session.set("checkedDate", checkedDate);
  }
  this.$(".datepicker").datepicker({
    todayHighlight: true,
    calendarWeeks: true
  }).datepicker("update", checkedDate);

  $('.editMenuItemName').editable({
    type: "text",
    title: 'Edit menu name',
    showbuttons: true,
    display: false,
    mode: 'inline',
    toggle: 'mouseenter',
    success: function(response, newValue) {
      var id = $(this).attr("data-id");
      
      if(id) {
        Meteor.call("updateMenuItemName", id, newValue, function(err) {
          if(err) {
            console.log(err);
            return alert(err.reason);
          }
        });
      }
    }
  });
}