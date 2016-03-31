//context: shift (Shift), shiftState (String)

Template.shiftItem.helpers({
  section: function () {
    var sectionId = this.shift && this.shift.section;
    var section = Sections.findOne({_id: sectionId});
    return section && section.name || "Open";
  },

  hasClaimed: function () {
    var shift = this.shift;
    return shift && shift.claimedBy && shift.claimedBy.indexOf(Meteor.userId()) >= 0;
  },

  hadBeenRejected: function () {
    var shift = this.shift;
    return shift && shift.rejectedFor && shift.rejectedFor.indexOf(Meteor.userId()) >= 0;
  },

  isUnavailable: function () {
    var queryForInterval = function (fields, interval) {
      // ['startTime', 'endTime'] => [{'startTime: interval}, {endTime: interval}]
      return _.map(fields, function (field) {
        var query = {};
        query[field] = interval;
        return query;
      });
    };

    var shift = this.shift;
    var interval = TimeRangeQueryBuilder.forInterval(shift.startTime, shift.endTime);

    var existingShift = !!Shifts.findOne({
      type: null,
      assignedTo: Meteor.userId(),
      published: true,
      $or: queryForInterval(['startTime', 'endTime'], interval)
    });

    var leaveRequest = !!LeaveRequests.findOne({
      userId: Meteor.userId(),
      status: 'approved',
      $or: queryForInterval(['startDate', 'endDate'], interval)
    });

    return existingShift || leaveRequest;
  },

  confirmed: function () {
    return this.shift && this.shift.confirmed && "success";
  },

  isPermitted: function () {
    var shift = this.shift;
    return shift && shift.startTime && moment().isBefore(shift.startTime);
  },

  timeRecorded: function () {
    var shift = this.shift;
    var startTime = shift && shift.startTime;
    if (moment().isAfter(startTime)) {
      return shift.startedAt && shift.finishedAt && shift.finishedAt - shift.startedAt;
    }
  },

  activeShift: function () {
    return !!(this.shift && this.shift.status === 'started');
  },

  open: function () {
    return this.shiftState === 'open';
  },

  past: function () {
    return this.shiftState === 'past';
  },

  formatLocationTime: function (time) {
    let area = HospoHero.getCurrentArea();
    return area && HospoHero.dateUtils.formatDateWithTimezone(time, 'h:mm a', area.locationId);
  },

  timeDuration: function (time) {
    var hours = moment.duration(time).hours();
    var mins = moment.duration(time).minutes();

    var timeFormat = function (value, name) {
      if (value > 0) {
        var result = value + ' ' + name;
        return value === 1 ? result : result + 's';
      } else {
        return '';
      }
    };

    var durationText = timeFormat(hours, 'hour') + ' ' + timeFormat(mins, 'minute');
    return durationText.trim();
  }
});

Template.shiftItem.events({
  'click .claim-shift-button': function (event, tmpl) {
    Meteor.call("claimShift", tmpl.data.shift._id, HospoHero.handleMethodResult());
  }
});