Meteor.publishComposite('managerNotes', function (weekRange, areaId) {
  check(weekRange, HospoHero.checkers.WeekRange);
  check(areaId, HospoHero.checkers.MongoId);

  let permissionChecker = this.userId && new HospoHero.security.PermissionChecker(this.userId);
  if (!permissionChecker || !permissionChecker.hasPermissionInArea(areaId, 'view roster')) {
    this.ready();
    return;
  }

  return {
    find: function () {
      return ManagerNotes.find({
        noteDate: weekRange,
        'relations.areaId': areaId
      });
    },
    children: [
      {
        find: function (note) {
          const query = {
            reference: note._id,
            'relations.areaId': areaId
          };

          return Comments.find(query, {
            sort: {createdOn: -1},
            limit: 10
          });
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
      }
    ]
  };
});