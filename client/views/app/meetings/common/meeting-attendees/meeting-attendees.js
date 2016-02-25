// context Meeting
Template.meetingAttendees.helpers({
  attendeeStatus(userId) {
    const meeting = Template.parentData(1);
    const stateCssClasses = ['text-navy', 'text-warning', 'text-danger'];

    let isInArray = (field) => meeting[field].indexOf(userId) > -1 ? field : false;


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