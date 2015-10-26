var component = FlowComponents.define('weeklyHeader', function (props) {
  this.set('year', props.year);
  this.set('week', props.week);
  this.set('onDateChanged', props.onDateChanged);
  this.set('collapseIn', false);
});

component.state.isPublished = function () {
  var date = moment().week(Router.current().params.week);

  this.set('publishedOnDate', date);

  var shiftDateQuery = TimeRangeQueryBuilder.forWeek(date);
  return !!Shifts.findOne({
    shiftDate: shiftDateQuery,
    published: true,
    'relations.areaId': HospoHero.getCurrentAreaId()
  });
};

component.action.triggerCollapse = function () {
  this.set('collapseIn', !this.get('collapseIn'));
};

component.action.publishRoster = function () {
  var weekNo = Router.current().params.week;
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
    Meteor.call("publishRoster", weekNo, tobePublished, fHospoHero.handleMethodResult());
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

          Meteor.call("notifyRoster", sendTo, info, HospoHero.handleMethodResult());
        }
      }
    });
  }
};