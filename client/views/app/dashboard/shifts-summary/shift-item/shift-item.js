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
    return !!(this.shift && this.shift.status == 'started');
  },

  open: function () {
    return this.shiftState == 'open';
  },

  past: function () {
    return this.shiftState == 'past';
  }
});

Template.shiftItem.events({
  'click .claim-shift-button': function (event, tmpl) {
    Meteor.call("claimShift", tmpl.data.shift._id, HospoHero.handleMethodResult());
  }
});