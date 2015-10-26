Meteor.publishComposite('comments', function (ref) {
  return {
    find: function() {
      if(this.userId) {
        var query = {
          "reference": ref,
          "relations.areaId": HospoHero.getCurrentAreaId(this.userId)
        };

        logger.info("Comments published", ref);
        return Comments.find(query, {
          sort: {"createdOn": -1},
          limit: 10
        });
      } else {
        this.ready();
      }
    },
    children: [
      {
        find: function(comment) {
          return Meteor.users.find({
            _id: comment.createdBy
          });
        }
      }
    ]
  }
});