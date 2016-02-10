Meteor.methods({
  createMeeting (meetingDoc) {
    check(meetingDoc, HospoHero.checkers.MeetingChecker);

    if (!HospoHero.canUser("create meetings")) {
      throw new Meteor.Error('You can\'t create meetings');
    } else {
      let defaultMeeting = {
        accepted: [],
        maybeAccepted: [],
        rejected: [],
        createdBy: Meteor.userId(),
        createdAt: new Date()
      };

      _.extend(meetingDoc, defaultMeeting);

      let meetingId = Meetings.insert(meetingDoc);

      if (meetingDoc.attendees.length) {
        let templateData = {
          meeting: {
            title: meetingDoc.title,
            location: meetingDoc.location,
            time: HospoHero.dateUtils.dateInterval(meetingDoc.startTime, meetingDoc.endTime)
          }
        };

        let options = {
          interactive: true,
          helpers: {
            url () {
              return NotificationSender.urlFor('meetingDetails', {id: meetingId}, this);
            },

            yesUrl () {
              return NotificationSender.actionUrlFor('accept-meeting-invite', 'accepted', this);
            },

            maybeUrl () {
              return NotificationSender.actionUrlFor('accept-meeting-invite', 'maybeAccepted', this);
            },

            noUrl () {
              return NotificationSender.actionUrlFor('accept-meeting-invite', 'rejected', this);
            }
          },

          meta: {
            meetingId: meetingId
          }
        };

        let notificationSender = new NotificationSender('New meeting', 'new-meeting', templateData, options);
        meetingDoc.attendees.forEach((userId) => {
          notificationSender.sendBoth(userId);
        });
      }
    }
  },

  editMeeting (newMeetingObject) {
    check(newMeetingObject, HospoHero.checkers.MeetingChecker);

    if (!HospoHero.canUser('create meetings')) {
      throw new Meteor.Error('Yot can\'t edit the meeting');
    } else {
      Meetings.update({_id: newMeetingObject._id}, {$set: newMeetingObject});
    }
  },

  'accept-meeting-invite' (notificationId, action) {
    let userId = Meteor.userId();
    let notification = Notifications.findOne({_id: notificationId});

    if (notification) {
      let meetingId = notification.meta.meetingId;
      let meeting = Meetings.findOne({_id: meetingId, attendees: userId});

      if (meeting) {
        let changeArrayValue = (array, isAddingNewValue) => {
          if (isAddingNewValue) {
            array.push(userId);
          } else {
            array = _.without(array, userId)
          }
          return array;
        };

        ['accepted','maybeAccepted','rejected'].forEach((field) => {
          meeting[field] = changeArrayValue(meeting[field], field === action);
        });

        Meteor.call('editMeeting', meeting);
      } else {
        throw new Meteor.Error(403, 'You are not invited on this meeting');
      }
      Notifications.remove({_id: notificationId});
    }
  }
});