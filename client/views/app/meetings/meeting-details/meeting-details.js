Template.meetingDetails.onCreated(function () {
  this.meeting = () => {
    return Meetings.findOne({_id: this.data.id});
  };
});


Template.meetingDetails.onRendered(function () {
  let success = (field) => {
    return (undefinedParam, newValue) => {
      let meeting = this.meeting();
      meeting[field] = newValue;
      Meteor.call('editMeeting', meeting, HospoHero.handleMethodResult());
    };
  };

  // declare editable fields
  ['title', 'location'].forEach((field) => {
    this.$(`.meeting-${field}-editable`).editable({
      showbuttons: true,
      display: false,
      success: success(field)
    });
  });

  /**
   * Saves the new meeting document
   * @param {String} field - the name of field to save
   * @param {String} value - the value to save
   * @returns {Function}
   */
  this.saveMeeting = (field, value) => {
    return success(field)(false, value);
  };
});


Template.meetingDetails.helpers({
  meeting () {
    return Template.instance().meeting();
  },

  agendaAndMinutes () {
    let meeting = Template.instance().meeting();
    return meeting.agendaAndMinutes || 'Click to edit...';
  },

  saveChanges () {
    let tmpl = Template.instance();
    return (agendaAndMinutes) => {
      tmpl.saveMeeting('agendaAndMinutes', agendaAndMinutes);
    };
  },

  meetingDetailsOptions () {
    return {
      namespace: 'meeting',
      uiStateId: 'details',
      title: 'Meeting Details'
    };
  },

  agendaOptions () {
    return {
      namespace: 'meeting',
      uiStateId: 'agenda',
      title: 'Agenda & Minutes',
      contentPadding: '20px'
    };
  }
});