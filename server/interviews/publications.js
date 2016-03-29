let canUserEditInterviews = (userId, areaId = null) => {
  let checker = new HospoHero.security.PermissionChecker(userId);
  return checker.hasPermissionInArea(areaId, 'edit interviews');
};

Meteor.publishComposite('interviews', function () {
  if (!this.userId) {
    this.ready();
  } else {
    let userId = this.userId;
    let areaId = HospoHero.getCurrentAreaId(userId);

    if (!canUserEditInterviews(userId, areaId)) {
      this.ready();
    } else {
      return {
        find () {
          let query = {
            $or: interviewQuery(userId)
          };

          return Interviews.find(query);
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
    }
  }
});


Meteor.publishComposite('interview', function (interviewId, userId) {
  check(interviewId, HospoHero.checkers.MongoId);
  check(userId, HospoHero.checkers.MongoId);

  let areaId = HospoHero.getCurrentAreaId(userId);

  if (!canUserEditInterviews(userId, areaId)) {
    this.ready();
  } else {
    return {
      find () {
        return Interviews.find({
          _id: interviewId,
          $or: interviewQuery(userId)
        });
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
    }
  }
});

function interviewQuery(userId) {
  return [
    {createdBy: userId},
    {interviewers: userId}
  ];
}

function usersPublication(interview) {
  return Meteor.users.find({
    _id: {
      $in: interview.interviewers || []
    }
  }, {
    fields: HospoHero.security.getPublishFieldsFor('users')
  });
}

function applicationPublication(interview) {
  return Applications.find({_id: interview.applicationId});
}