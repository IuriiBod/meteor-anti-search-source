let projectQueryByUserId = (userId) => {
  return [
    {lead: userId},
    {team: userId},
    {createdBy: userId}
  ];
};

Meteor.publishComposite('projects', function (userId) {
  return {
    find () {
      if (this.userId) {
        let query = {};

        if (userId) {
          query.$or = projectQueryByUserId(userId);
        }
        return Projects.find(query);
      } else {
        this.ready();
      }
    },

    children: [
      {
        find: usersPublication
      }
    ]
  }
});


Meteor.publishComposite('project', function (projectId, userId) {
  return {
    find () {
      if (this.userId) {
        return Projects.find({
          _id: projectId,
          $or: projectQueryByUserId(userId)
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
        find (project) {
          return Comments.find({
            reference: project._id
          });
        }
      }
    ]
  }
});

function usersPublication(project) {
  const userIdsToPublish = _.union(project.lead, project.team);
  return Meteor.users.find({
    _id: {
      $in: userIdsToPublish
    }
  }, {
    fields: {
      _id: 1,
      profile: 1,
      'services.google.picture': 1
    }
  });
}