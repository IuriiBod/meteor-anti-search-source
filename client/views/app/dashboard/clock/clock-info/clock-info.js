//context: Shift
Template.clockInfo.helpers({
  clockStatus: function () {
    var shiftClockStatusMap = {
      draft: 'clockIn',
      started: 'clockOut',
      finished: 'clockInfo'
    };

    return shiftClockStatusMap[this.status];
  },

  backgroundClassByStatus: function (status) {
    var bgMap = {
      clockIn: 'navy-bg',
      clockOut: 'red-bg',
      clockInfo: 'lazur-bg'
    };

    return bgMap[status];
  },

  titleByStatus: function (status) {
    var titleMap = {
      clockIn: 'Clock In',
      clockOut: 'Clock Out',
      clockInfo: 'Clock Ended'
    };

    return titleMap[status];
  },

  clockInfoByStatus: function (status) {
    var shift = this;

    var infoFnMap = {
      clockIn: function () {
        var startTimeMoment = moment(shift.startTime);
        var fromNowStr = startTimeMoment.fromNow();
        var startWord = startTimeMoment.isAfter(new Date()) ? 'starts' : 'started';
        return 'Today shift ' + startWord + ' ' + fromNowStr;
      },

      clockOut: function () {
        var recordedTime = moment().diff(shift.startedAt);
        return 'Recording ' + moment.duration(recordedTime).humanize();
      },

      clockInfo: function () {
        var recordedTime = moment(shift.finishedAt).diff(shift.startedAt);
        return 'Recorded ' + moment.duration(recordedTime).humanize();
      }
    };

    return infoFnMap[status]();
  }
});

Template.clockInfo.events({
  'click .clockIn': function (event, tmpl) {
    var shiftId = tmpl.data._id;
    Meteor.call("clockIn", shiftId, HospoHero.handleMethodResult());
  },

  'click .clockOut': function (event, tmpl) {
    var shiftId = tmpl.data._id;
    Meteor.call("clockOut", shiftId, HospoHero.handleMethodResult());
  }
});
