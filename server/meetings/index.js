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
          url () {
            return NotificationSender.urlFor('meetingDetails', {id: meetingId}, this);
          },

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

    let fields = {
      yes: 'accepted',
      maybe: 'maybeAccepted',
      no: 'rejected'
    };
    delete fields[action];

    console.log('FI', fields);
    

    fields = _.map(fields, (value) => {
      return {
        [value]: userId
      }
    });

    console.log('FIELDS', fields);


    let query = {
      $push: {
        [action]: userId
      },

      $pop: fields
    };

    console.log('QUERY', query);

    return false;
    let notification = Notifications.findOne({_id: notificationId});

    if (notification) {
      let meetingId = notification.meta.meetingId;
      Meetings.update({_id: meetingId, attendees: userId}, {$set: query});
      Notifications.remove({_id: notificationId});
    }
  }
});