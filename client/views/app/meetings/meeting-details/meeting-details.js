Template.meetingDetails.onCreated(function () {
  this.meeting = () => {
    return Meetings.findOne({_id: this.data.id});
  };
});


Template.meetingDetails.onRendered(function () {
  let success = (field) => {
    return (undefinedParam, newValue, onDataSaved) => {
      let meeting = this.meeting();
      meeting[field] = newValue;
      Meteor.call('editMeeting', meeting, HospoHero.handleMethodResult(() => {
        if (_.isFunction(onDataSaved)) {
          // this callback is required by autosave text editor
          onDataSaved();
        }
      }));
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
   * @param {Function} [onDataSaved] - notifies editor about successful saving
   * @returns {Function}
   */
  this.saveMeeting = (field, value, onDataSaved) => {
    return success(field)(false, value, onDataSaved);
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

  onSaveAgenda () {
    let tmpl = Template.instance();
    return (agendaAndMinutes, onDataSaved) => {
      tmpl.saveMeeting('agendaAndMinutes', agendaAndMinutes, onDataSaved);
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