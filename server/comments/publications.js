Meteor.publishComposite('comments', function (referenceId, areaId) {
  return {
    find: function () {
      if (this.userId) {
        var query = {
          reference: referenceId,
          'relations.areaId': areaId
        };

        return Comments.find(query, {
          sort: {createdOn: -1},
          limit: 10
        });
      } else {
        this.ready();
      }
    },
    children: [
      {
        find: function (comment) {
          return Meteor.users.find({
            _id: comment.createdBy
          }, {
            fields: HospoHero.security.getPublishFieldsFor('users')
          });
        }
      }
    ]
  };
});