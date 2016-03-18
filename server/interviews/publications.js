Meteor.publishComposite('interviews', function (userId) {
  return {
    find () {
      if (this.userId) {
        let query = {};

        if (userId) {
          query.interviewers = userId;
        }
        return Interviews.find(query);
      } else {
        this.ready();
      }
    },

    children: [
      {
        find: usersPublication
      },

      {
        find: applicationPublication
      }
    ]
  };
});


Meteor.publishComposite('interview', function (interviewId, userId) {
  return {
    find () {
      if (this.userId) {
        return Interviews.find({
          _id: interviewId,
          interviewers: userId
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
        find: applicationPublication
      },

      {
        find (interview) {
          return Comments.find({
            reference: interview._id
          });
        }
      }
    ]
  };
});

function usersPublication(interview) {
  return Meteor.users.find({
    _id: {
      $in: interview.interviewers
    }
  }, {
    fields: {
      _id: 1,
      profile: 1,
      'services.google.picture': 1
    }
  });
}

function applicationPublication(interview) {
  return Applications.find({_id: interview.applicationId});
}