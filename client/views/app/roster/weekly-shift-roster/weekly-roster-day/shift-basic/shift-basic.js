Template.shiftBasic.onCreated(function () {
  var self = this;

  let updateTimeIntervalForLocation = (startTime, endTime, locationId) => {
    let newInterval = {
      startTime: HospoHero.dateUtils.convertDateForLocation(startTime, locationId),
      endTime: HospoHero.dateUtils.convertDateForLocation(endTime, locationId)
    };

    if (moment(newInterval.startTime).isAfter(newInterval.endTime)) {
      newInterval.endTime = moment(newInterval.endTime).add(1, 'day').toDate();
    }

    return newInterval;
  };

  self.editShiftTime = function (newStartTime, newEndTime) {
    let shift = this.data.shift;
    let dateTimeInterval = updateTimeIntervalForLocation(newStartTime, newEndTime, shift.relations.locationId);
    shift.startTime = dateTimeInterval.startTime;
    shift.endTime = dateTimeInterval.endTime;
    console.log('dateTimeInterval => ', dateTimeInterval);
    Meteor.call('editShift', shift, HospoHero.handleMethodResult());
  };
});

Template.shiftBasic.helpers({
  comboDateParams: function () {
    var tmpl = Template.instance();
    return {
      firstTime: tmpl.data.shift.startTime,
      secondTime: tmpl.data.shift.endTime,
      minuteStepping: 15,
      ignoreDateRangeCheck: true,
      onSubmit: function (startTime, endTime) {
        tmpl.editShiftTime(startTime, endTime);
      }
    };
  },
  isMidnight: function () {
    return !moment(this.startTime).isSame(this.endTime, 'day');
  }
});

Template.shiftBasic.events({
  'click .remove-shift-button': function (event, tmpl) {
    event.preventDefault();
    Meteor.call('deleteShift', tmpl.data.shift._id, HospoHero.handleMethodResult());
  },
  'click .copy-shift-button': function (event, tmpl) {
    event.preventDefault();
    tmpl.data.onCopyShift(tmpl.data.shift);
  }
});