Template.dailyShiftScheduling.events({
  'click .editShiftProfile': function (event) {
    event.preventDefault();
    var shiftId = $(event.target).attr("data-id");
    Session.set("thisShift", shiftId);
    $("#shiftProfile").modal();
  },

  'click .fc-title': function (event) {
    event.stopPropagation();
    var id = $(event.target).attr("data-id");
    var shiftId = $(event.target).attr("data-shift");
    Session.set("thisJob", id);
    Session.set("shiftId", shiftId);
    var $flyoutContainer = $(".flyout-container");
    if ($flyoutContainer.hasClass("show")) {
      $flyoutContainer.removeClass("show");
    } else {
      $flyoutContainer.addClass("show");
    }
    return false;
  },

  'change .selectWorkers': function (event) {
    var workerId = $(event.target).val();
    var shiftId = $(event.target).attr("data-id");
    Meteor.call("assignWorker", workerId, shiftId, function (err) {
      if (err) {
        console.log(err);
        alert(err.reason);
        $(event.target).val("");
      }
    });
  }
});

Template.dailyShiftScheduling.onRendered(function () {
  var routeDate = Router.current().params.date;
  if (!routeDate) {
    return false;
  }

  var calendar = new Template.dailyShiftScheduling.Calendar(this, {
    shiftDate: routeDate,
    oneDay: 1000 * 3600 * 24,
    businessStartsAt: 8,
    businessEndsAt: 5
  });
  Tracker.autorun(function () {
    Meteor.defer(function () {
      Meteor.call("generateRecurrings", routeDate, function (err) {
        if (err) {
          console.log(err);
        } else {
          calendar.update();
        }
      });
    });
  });
});
