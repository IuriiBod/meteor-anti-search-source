Meteor.publishComposite('projects', function (userId) {
  return {
    find () {
      if (this.userId) {
        let query = {};

        if (userId) {
          query.$or = [
            {lead: userId},
            {team: userId},
            {createdBy: userId}
          ];
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
          $or: [
            {lead: userId},
            {team: userId},
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
        find (project) {
          return Comments.find({
            reference: project._id
          });
        }
      }
    ]
  }
});

function usersPublication (project) {
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