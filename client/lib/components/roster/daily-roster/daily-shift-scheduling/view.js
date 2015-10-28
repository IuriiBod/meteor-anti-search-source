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
  },

  'change .selectWorkers': function (event) {
    var workerId = $(event.target).val();
    var shiftId = $(event.target).attr("data-id");

    var shift = Shifts.findOne({_id: shiftId});
    shift.assignedTo = workerId;
    Meteor.call('updateShift', shift, HospoHero.handleMethodResult());
  },

  //todo: get rid of event handlers duplication!!!
  'click .generateRecurring': function (event) {
    event.preventDefault();
    var date = Router.current().params.date;
    Meteor.call("generateRecurrings", date, HospoHero.handleMethodResult());

    //todo: get rid of this stuff, it should be done on server side
    var shift = Shifts.find({_id: shiftId});
    if (shift) {
      var shiftUpdateDoc = {
        to: workerId,
        userId: Meteor.userId(),
        shiftId: shiftId,
        text: "You have been assigned to shift dated <b>" + HospoHero.dateUtils.intervalDateFormat(shift.startTime, shift.endTime) + "</b>",
        type: "update"
      };
      Meteor.call("addShiftUpdate", shiftUpdateDoc, HospoHero.handleMethodResult());
    }
  },

  'click .generateRecurring': function (event) {
    event.preventDefault();
    var date = Router.current().params.date;
    Meteor.call("generateRecurrings", date, HospoHero.handleMethodResult());
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