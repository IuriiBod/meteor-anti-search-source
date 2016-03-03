// context Meeting
Template.meetingAttendee.onRendered(function () {
  if (this.data.allowRemove) {
    const username = HospoHero.username(this.data.member);

    this.$('.remove-user').popover({
      content: `<button type="button" class="btn btn-danger accept-remove">Remove ${username}</button>`,
      html: true,
      placement: 'bottom'
    });
  }
});


Template.meetingAttendee.helpers({
  attendeeStatus() {
    const meeting = Template.parentData(2).meeting;
    const stateCssClasses = ['text-navy', 'text-warning', 'text-danger'];

    let isInArray = (field) => meeting[field].indexOf(this.member) > -1 ? field : false;

    let attendeeStatusClass = '';
    ['accepted', 'maybeAccepted', 'rejected'].some((field, index) => {
      if (isInArray(field)) {
        attendeeStatusClass = stateCssClasses[index];
        return true;
      } else {
        return false;
      }
    });

    return attendeeStatusClass;
  }
});


Template.meetingAttendee.events({
  'click .accept-remove' (event, tmpl) {
    if (_.isFunction(tmpl.data.onUserRemove)) {
      tmpl.data.onUserRemove(tmpl.data.member);
    }
  }
});