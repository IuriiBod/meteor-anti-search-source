Template.meetingDetails.onCreated(function () {
  this.meeting = Meetings.findOne({
    _id: this.data.id
  });
});


Template.meetingDetails.helpers({
  meeting () {
    return Template.instance().meeting;
  },

  buttonClass (buttonType) {
    let meeting = Template.instance().meeting;
    let field = buttonType === 'yes' ? 'accepted' : buttonType === 'maybe' ? 'maybeAccepted' : 'rejected';
    return meeting[field].indexOf(Meteor.userId()) > 0;
  }
});


Template.meetingDetails.events({
  'click .btn' () {
    Meteor.call('accept-meeting-invite', 'yes', HospoHero.handleMethodResult());
  }
});