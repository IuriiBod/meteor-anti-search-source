Meteor.publishComposite('meetings', function (userId, locationId) {
  return {
    find () {
      if (this.userId) {
        return Meetings.find({
          $or: [
            {attendees: userId},
            {createdBy:userId}
          ]
        });
      } else {
        this.ready();
      }
    },

    children: [
      {
        find (meeting) {
          if (meeting.attendees && meeting.attendees.length) {
            return Meteor.users.find({
              _id: {
                $in: meeting.attendees
              }
            }, {
              fields: {
                _id: 1,
                profile: 1
              }
            });
          } else {
            this.ready();
          }
        }
      }
    ]
  }
});


Meteor.publishComposite('meeting', function (meetingId, userId) {
  return {
    find () {
      if (this.userId) {
        return Meetings.find({
          _id: meetingId,
          attendees: userId
        });
      } else {
        this.ready();
      }
    },

    children: [
      {
        find (meeting) {
          if (meeting.attendees && meeting.attendees.length) {
            return Meteor.users.find({
              _id: {
                $in: meeting.attendees
              }
            }, {
              fields: {
                _id: 1,
                profile: 1
              }
            });
          } else {
            this.ready();
          }
        }
      }
    ]
  }
});