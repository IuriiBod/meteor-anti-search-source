Template.shiftBasic.onCreated(function () {
  var self = this;

  self.editShiftTime = function (newStartTime, newEndTime) {
    let shift = this.data;

    shift.startTime = HospoHero.dateUtils.applyTimeToDate(shift.startTime, newStartTime);
    shift.endTime = HospoHero.dateUtils.applyTimeToDate(shift.endTime, newEndTime);

    Meteor.call('editShift', shift, HospoHero.handleMethodResult());
  };
});

Template.shiftBasic.helpers({
  comboDateParams: function () {
    var tmpl = Template.instance();
    return {
      firstTime: tmpl.data.startTime,
      secondTime: tmpl.data.endTime,
      minuteStepping: 15,
      onSubmit: function (startTime, endTime) {
        tmpl.editShiftTime(startTime, endTime);
      }
    };
  }
});

Template.shiftBasic.events({
  'click .remove-shift-button': function (event, tmpl) {
    event.preventDefault();
    Meteor.call("deleteShift", tmpl.data._id, HospoHero.handleMethodResult());
  }
});