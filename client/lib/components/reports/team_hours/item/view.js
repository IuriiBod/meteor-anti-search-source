Template.teamHoursItem.helpers({
  timeDurationWithDecimal: function (time) {
    var hours = moment.duration(time).hours();
    var mins = moment.duration(time).minutes();
    var text = null;
    if (mins < 10) {
      text = hours + ".0" + mins;
    } else {
      text = hours + "." + mins;
    }
    return text;
  }
});

Template.teamHoursItem.events({
  'click .stopCurrentShift': function (event) {
    event.preventDefault();
    var id = $(event.target).attr("data-shift");
    var confirmClockout = confirm("Are you sure you want to clockout this shift ?");
    if (confirmClockout && id) {
      Meteor.call("clockOut", id, HospoHero.handleMethodResult());
    }
  }
});