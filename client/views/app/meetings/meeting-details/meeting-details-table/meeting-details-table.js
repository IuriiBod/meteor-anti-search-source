Template.meetingDetailsTable.helpers({
  isMeetingCreator () {
    return this.meeting.createdBy === Meteor.userId();
  },

  canAttendInMeeting () {
    return this.meeting.attendees.indexOf(Meteor.userId()) > -1;
  },

  timeComboEditableParams () {
    let meeting = this.meeting;
    return {
      withoutIcon: true,
      minuteStepping: 10,
      firstTime: meeting.startTime,
      secondTime: meeting.endTime,
      onSubmit: function (startTime, endTime) {
        let applyTime = HospoHero.dateUtils.applyTimeToDate;
        _.extend(meeting, {
          startTime: applyTime(meeting.startTime, startTime),
          endTime: applyTime(meeting.endTime, endTime)
        });

        Meteor.call('editMeeting', meeting, HospoHero.handleMethodResult());
      }
    };
  },

  onDateChange () {
    let meeting = this.meeting;

    return (newDate) => {
      if (meeting.startTime.valueOf() !== newDate.valueOf()) {
        meeting.startTime = HospoHero.dateUtils.applyTimeToDate(newDate, meeting.startTime);
        meeting.endTime = HospoHero.dateUtils.applyTimeToDate(newDate, meeting.endTime);
        Meteor.call('editMeeting', meeting, HospoHero.handleMethodResult());
      }
    };
  },

  onUserRemove () {
    let meeting = this.meeting;

    return (userId) => {
      let removeUserIdFromArray = (field) => meeting[field].splice(meeting[field].indexOf(userId), 1);
      ['attendees', 'accepted', 'maybeAccepted', 'rejected'].forEach((field) => removeUserIdFromArray(field));
      Meteor.call('editMeeting', meeting, HospoHero.handleMethodResult());
    };
  }
});


Template.meetingDetailsTable.events({
  'click .add-user' (event, tmpl) {
    let meeting = tmpl.data.meeting;

    let onUserSelect = (userId) => {
      meeting.attendees.push(userId);
      Meteor.call('editMeeting', meeting, HospoHero.handleMethodResult());
    };

    FlyoutManager.open('wrapperFlyout', {
      template: 'usersSearch',
      title: "Searching users",
      data: {
        selectedUsers: meeting.attendees,
        onUserSelect: onUserSelect
      }
    });
  }
});