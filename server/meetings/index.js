Meteor.methods({
  createMeeting (meetingDoc) {
    check(meetingDoc, HospoHero.checkers.MeetingChecker);

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
          url: NotificationSender.urlFor('meeting', {id: meetingId}, this),

          yesUrl () {
            return NotificationSender.actionUrlFor('accept-meeting-invite', 'yes', this);
          },

          maybeUrl () {
            return NotificationSender.actionUrlFor('accept-meeting-invite', 'maybe', this);
          },

          noUrl () {
            return NotificationSender.actionUrlFor('accept-meeting-invite', 'no', this);
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
  },


  'accept-meeting-invite' (notificationId, action) {
    let userId = Meteor.userId();
    let notification = Notifications.findOne({_id: notificationId});

    if (notification) {
      let meetingId = notification.meta.meetingId;
      let meeting = Meetings.findOne({_id: meetingId, attendees: userId});

      if (meeting) {
        let actionField = action === 'yes' ? 'accepted' : action === 'maybe' ? 'maybeAccepted' : 'rejected';
        meeting[actionField].push(userId);
        Meetings.update({_id: meetingId}, {$set: meeting});
      } else {
        throw new Meteor.Error(403, 'You are not invited on this meeting');
      }

      Notifications.remove({_id: notificationId});
    }
  }
});