Template.meetingDetails.onCreated(function () {
  this.meeting = () => {
    return Meetings.findOne({_id: this.data.id})
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

  isMeetingCreator () {
    return Template.instance().meeting().createdBy === Meteor.userId();
  },

  agendaAndMinutes () {
    let meeting = Template.instance().meeting();
    return meeting.agendaAndMinutes || 'Click to edit...';
  },

  saveChanges () {
    let tmpl = Template.instance();
    return (agendaAndMinutes) => {
      tmpl.saveMeeting('agendaAndMinutes', agendaAndMinutes);
    }
  },

  onDateChange () {
    let meeting = Template.instance().meeting();

    return (newDate) => {
      meeting.startTime = HospoHero.dateUtils.applyTimeToDate(newDate, meeting.startTime);
      meeting.endTime  = HospoHero.dateUtils.applyTimeToDate(newDate, meeting.endTime );
      Meteor.call('editMeeting', meeting, HospoHero.handleMethodResult());
    }
  },

  timeComboEditableParams () {
    let meeting = Template.instance().meeting();
    return {
      minuteStepping: 10,
      firstTime: meeting.startTime,
      secondTime: meeting.endTime,
      onSubmit: function (startTime, endTime) {
        meeting.startTime = startTime;
        meeting.endTime = endTime;
        Meteor.call('editMeeting', meeting, HospoHero.handleMethodResult());
      }
    }
  },

  meetingDetailsOptions () {
    return {
      namespace: 'meeting',
      uiStateId: 'details',
      title: 'Meeting Details',
      contentPadding: 'no-padding'
    }
  },

  agendaOptions () {
    return {
      namespace: 'meeting',
      uiStateId: 'agenda',
      title: 'Agenda & Minutes'
    }
  }
});


Template.meetingDetails.events({
  'click .add-user' (event, tmpl) {
    let meeting = tmpl.meeting();

    let onUserSelect = () => {
      return (userId) => {
        meeting.attendees.push(userId);
        Meteor.call('editMeeting', meeting, HospoHero.handleMethodResult(function () {
          HospoHero.success('User have been added to the meeting');
        }));
      }
    };

    FlyoutManager.open('usersSearchFlyout', {
      selectedUsers: meeting.attendees,
      onUserSelect: onUserSelect
    });
  }
});