Meteor.publishComposite('meetings', function (userId) {
  return {
    find () {
      if (this.userId) {
        let query = {};

        if (userId) {
          query.$or = [
            {attendees: userId},
            {createdBy: userId}
          ];
        }
        return Meetings.find(query);
      } else {
        this.ready();
      }
    },

    children: [
      {
        find: usersPublication
      }
    ]
  };
});


Meteor.publishComposite('meeting', function (meetingId, userId) {
  return {
    find () {
      if (this.userId) {
        return Meetings.find({
          _id: meetingId,
          $or: [
            {attendees: userId},
            {createdBy: userId}
          ]
        });
      } else {
        this.ready();
      }
    },

    children: [
      {
        find: usersPublication
      },

      {
        find (meeting) {
          return Comments.find({
            reference: meeting._id
          });
        }
      }
    ]
  };
});

function usersPublication(meeting) {
  if (meeting.attendees && meeting.attendees.length) {
    return Meteor.users.find({
      _id: {
        $in: meeting.attendees
      }
    }, {
      fields: {
        _id: 1,
        profile: 1,
        'services.google.picture': 1
      }
    });
  } else {
    this.ready();
  }
}