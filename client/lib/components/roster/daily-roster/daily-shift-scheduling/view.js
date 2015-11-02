Template.dailyShiftScheduling.events({

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
  }
});

Template.dailyShiftScheduling.onRendered(function () {
  var routeDate = Router.current().params.date;
  if (!routeDate) {
    return false;
  }

  var calendar = new Template.dailyShiftScheduling.Calendar(this, {
    shiftDate: new Date(new Date(routeDate).setUTCHours(24)),
    oneDay: 1000 * 3600 * 24,
    businessStartsAt: 8,
    businessEndsAt: 5
  });
  calendar.autoUpdate();
});