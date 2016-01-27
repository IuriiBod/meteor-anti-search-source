//context: Shift
Template.clockInfo.onCreated(function () {
  this.shiftClockStatuses = new Map()
    .set('draft', 'clockIn')
    .set('started', 'clockOut')
    .set('finished', 'clockInfo');
  this.backgrounds = new Map()
    .set('clockIn', 'navy-bg')
    .set('clockOut', 'red-bg')
    .set('clockInfo', 'lazur-bg');
  this.titles = new Map()
    .set('clockIn', 'Clock In')
    .set('clockOut', 'Clock Out')
    .set('clockInfo', 'Clock Ended');

  this.ClockInfo = class {
    constructor(shift) {
      this.shift = shift
    }

    clockIn() {
      let startTimeMoment = moment(shift.startTime);
      let howLongAgoWord = startTimeMoment.fromNow();
      let startWord = startTimeMoment.isAfter(new Date()) ? 'starts' : 'started';
      return `Today shift ${startWord} ${howLongAgoWord}`;
    }

    clockOut() {
      let recordedTime = moment().diff(shift.startedAt);
      let howManyMinutes = moment.duration(recordedTime).humanize();
      return `Recording ${howManyMinutes}`;
    }

    clockInfo() {
      let recordedTime = moment(shift.finishedAt).diff(shift.startedAt);
      let howManyMinutes = moment.duration(recordedTime).humanize();
      return `Recorded ${howManyMinutes}`;
    }

    getByStatus(status) {
      return this[status]();
    }
  }
});

Template.clockInfo.helpers({
  clockStatus: function () {
    return Template.instance().shiftClockStatuses.get(this.status);
  },

  backgroundClassByStatus: function (status) {
    return Template.instance().backgrounds.get(status);
  },

  titleByStatus: function (status) {
    return Template.instance().titles.get(status);
  },

  clockInfoByStatus: function (status) {
    let ClockInfo = Template.instance().ClockInfo;
    return new ClockInfo(shift = this).getByStatus(status);
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
