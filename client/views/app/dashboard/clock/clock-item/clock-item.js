Template.clockItem.events({
  'click .clockIn': function (event, tmpl) {
    var shiftId = tmpl.data.shift._id;
    Meteor.call("clockIn", shiftId, HospoHero.handleMethodResult());
  },

  'click .clockOut': function (event, tmpl) {
    var shiftId = tmpl.data.shift._id;
    Meteor.call("clockOut", shiftId, HospoHero.handleMethodResult(function () {
      $(".tip").show();
    }));
  }
});

Template.clockItem.helpers({
  timeFromNow: function () {
    var shift = this.shift;
    if (shift.text == "Clock In") {
      return this.get("timeLeft");
    } else if (this.item.text == "Clock Out") {
      return this.get("timeSpent");
    } else if (this.item.text == "Clock Ended") {
      var shiftId = Session.get("newlyEndedShift");
      var shift = Shifts.findOne(shiftId);
      var time = 0;
      if (shift) {
        time = shift.finishedAt - shift.startedAt;
        return time;
      }
    }
  }
})

component.state.clockIn = function () {
  return this.item.text == "Clock In";
};

component.state.clockOut = function () {
  return this.item.text == "Clock Out";
};


component.state.clockEnded = function () {
  return this.item.text == "Clock Ended";
};