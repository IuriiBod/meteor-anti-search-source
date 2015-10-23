Template.pageHeading.events({
  'click .todayRoster': function (event) {
    event.preventDefault();
    var date = moment().format("YYYY-MM-DD");
    Router.go("dailyRoster", {"date": date});
  },

  'click .prevDayRoster': function (event) {
    event.preventDefault();
    var date = Router.current().params.date;
    var yesterday = moment(date).subtract(1, "days").format("YYYY-MM-DD");
    Router.go("dailyRoster", {"date": yesterday});
  },

  'click .nextDayRoster': function (event) {
    event.preventDefault();
    var date = Router.current().params.date;
    var tomorrow = moment(date).add(1, "days").format("YYYY-MM-DD")
    Router.go("dailyRoster", {"date": tomorrow});
  },

  'click #publishRoster': function (event) {
    event.preventDefault();
    var weekNo = Session.get("thisWeek");
    var week = getDatesFromWeekNumber(parseInt(weekNo));
    var dates = [];
    week.forEach(function (day) {
      if (day && day.date) {
        dates.push(HospoHero.dateUtils.shiftDate(day.date));
      }
    });
    var shifts = Shifts.find({
      "shiftDate": {$in: dates},
      "published": false,
      "type": null,
      "relations.areaId": HospoHero.getCurrentAreaId()
    }).fetch();

    var tobePublished = [];
    var users = [];
    if (shifts.length > 0) {
      shifts.forEach(function (shift) {
        tobePublished.push(shift._id);
        if (users.indexOf(shift.assignedTo) < 0) {
          users.push(shift.assignedTo);
        }
      });
    }

    if (tobePublished.length > 0) {
      Meteor.call("publishRoster", weekNo, tobePublished, function (err) {
        if (err) {
          HospoHero.error(err);
        }
      });
      users.forEach(function (user) {
        var to = Meteor.users.findOne(user);
        if (to) {
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
          if (shiftsPublished && openShifts) {
            if (shiftsPublished.length > 0) {
              shiftsPublished.forEach(function (shift) {
                var start = moment(shift.startTime).format("hh:mm A");
                var end = moment(shift.endTime).format("hh:mm A");
                text += "<a href='" + Meteor.absoluteUrl() + "roster/shift/" + shift._id + "'>" + moment(shift.shiftDate).format("ddd, Do MMMM") + " shift from " + start + " - " + end + "</a>.<br>";
              });
            }

            var info = {
              "title": title,
              "text": text,
              "startDate": weekStart,
              "week": weekNo
            };
            if (openShifts.length > 0) {
              openShifts.forEach(function (shift) {
                var start = moment(shift.startTime).format("hh:mm A");
                var end = moment(shift.endTime).format("hh:mm A");
                open += "<a href='" + Meteor.absoluteUrl() + "roster/shift/" + shift._id + "'>" + moment(shift.shiftDate).format("ddd, Do MMMM") + " shift from " + start + " - " + end + "</a>.<br>";
              });
              info.openShifts = open;
            }

            var sendTo = {
              "_id": to._id,
              "email": to.emails[0].address,
              "name": to.username
            };

            Meteor.call("notifyRoster", sendTo, info, function (err) {
              if (err) {
                HospoHero.error(err);
              }
            });
          }
        }
      });
    }
  },

  'click #startNewStocktake': function (event) {
    event.preventDefault();
    var date = moment().format("YYYY-MM-DD");
    var stocktake = StocktakeMain.findOne({
      "stocktakeDate": new Date(date).getTime(),
      "relations.areaId": HospoHero.getCurrentAreaId()
    });

    if (stocktake) {
      $("#newStocktakeModal").modal();
    } else {
      Meteor.call("createMainStocktake", date, function (err, id) {
        if (err) {
          HospoHero.error(err);
        } else {
          Router.go("stocktakeCounting", {"_id": id});
        }
      });
    }
  },

  'click .showHideButton': function (event) {
    if (Session.get("collapsed")) {
      Session.set("collapsed", false);
    } else {
      Session.set("collapsed", true);
    }
  }
});

Template.pageHeading.rendered = function () {
  Session.set("collapsed", false);
  var checkedDate = Router.current().params.year;

  if (checkedDate) {
    var week = Router.current().params.week;
    Session.set("thisWeek", week);
    $(".day.active").siblings(".day").addClass("week");
  }


};