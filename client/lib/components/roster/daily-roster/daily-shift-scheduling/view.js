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
        $(event.target).val("");
        HospoHero.error(err);
      }
    });

    var shift = Shifts.find({_id: shiftId});
    if(shift) {
      var shiftUpdateDoc = {
        to: workerId,
        userId: Meteor.userId(),
        shiftId: shiftId,
        text: "You have been assigned to shift dated <b>" + HospoHero.dateUtils.intervalDateFormat(shift.startTime, shift.endTime) + "</b>",
        type: "update"
      };
      Meteor.call("addShiftUpdate", shiftUpdateDoc, function(err) {
        if(err) {
          HospoHero.error(err);
        }
      });
    }
  },

  'click .generateRecurring': function(event) {
    event.preventDefault();
    var date = Router.current().params.date;
    Meteor.call("generateRecurrings", date, function(err, result) {
      if(err) {
        HospoHero.error(err);
      }
    });

    var shift = Shifts.find({_id: shiftId});
    if(shift) {
      var shiftUpdateDoc = {
        to: workerId,
        userId: Meteor.userId(),
        shiftId: shiftId,
        text: "You have been assigned to shift dated <b>" + HospoHero.dateUtils.intervalDateFormat(shift.startTime, shift.endTime) + "</b>",
        type: "update"
      };
      Meteor.call("addShiftUpdate", shiftUpdateDoc, function(err) {
        if(err) {
          HospoHero.error(err);
        }
      });
    }
  },

  'click .generateRecurring': function(event) {
    event.preventDefault();
    var date = Router.current().params.date;
    console.log(date);
    Meteor.call("generateRecurrings", date, function(err, result) {
      if(err) {
        HospoHero.error(err);
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
    shiftDate: new Date(new Date(routeDate).setUTCHours(24)),
    oneDay: 1000 * 3600 * 24,
    businessStartsAt: 8,
    businessEndsAt: 5
  });
  calendar.autoUpdate();
});