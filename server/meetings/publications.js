Meteor.publishComposite('meetings', function (userId, locationId) {
  return {
    find: function () {
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
        find: function (meeting) {
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