//context: Shift
Template.clockInfo.onCreated(function () {
  this.shiftClockStatuses = {
    draft: 'clockIn',
    started: 'clockOut',
    finished: 'clockInfo'
  };
  this.backgrounds = {
    clockIn: 'navy-bg',
    clockOut: 'red-bg',
    clockInfo: 'lazur-bg'
  };
  this.titles = {
    clockIn: 'Clock In',
    clockOut: 'Clock Out',
    clockInfo: 'Clock Ended'
  };

  this.ClockInfo = class {
    constructor(shift) {
      this.shift = shift;
    }

    clockIn() {
      let startTimeMoment = moment(this.shift.startTime);
      let howLongAgoWord = startTimeMoment.fromNow();
      let startWord = startTimeMoment.isAfter(new Date()) ? 'starts' : 'started';
      return `Today shift ${startWord} ${howLongAgoWord}`;
    }

    clockOut() {
      let recordedTime = moment().diff(this.shift.startedAt);
      let howManyMinutes = moment.duration(recordedTime).humanize();
      return `Recording ${howManyMinutes}`;
    }

    clockInfo() {
      let recordedTime = moment(shift.finishedAt).diff(this.shift.startedAt);
      let howManyMinutes = moment.duration(recordedTime).humanize();
      return `Recorded ${howManyMinutes}`;
    }

    getByStatus(status) {
      return this[status]();
    }
  };
});

Template.clockInfo.helpers({
  clockStatus: function () {
    return Template.instance().shiftClockStatuses[this.status];
  },

  backgroundClassByStatus: function (status) {
    return Template.instance().backgrounds[status];
  },

  titleByStatus: function (status) {
    return Template.instance().titles[status];
  },

  clockInfoByStatus: function (status) {
    let ClockInfo = Template.instance().ClockInfo;
    return new ClockInfo(this).getByStatus(status);
  }
});

Template.clockInfo.events({
  'click .clockIn': function (event, tmpl) {
    var shiftId = tmpl.data._id;
    Meteor.call('clockIn', shiftId, HospoHero.handleMethodResult());
  },

  'click .clockOut': function (event, tmpl) {
    var shiftId = tmpl.data._id;
    Meteor.call('clockOut', shiftId, HospoHero.handleMethodResult());
  }
});
