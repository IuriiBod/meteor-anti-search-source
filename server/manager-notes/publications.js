Meteor.publishComposite('managerNotes', function (weekRange, areaId) {
  check(areaId, HospoHero.checkers.MongoId);
  check(weekRange, HospoHero.checkers.WeekRange);

  return {
    find: function () {
      const daysOfWeek = HospoHero.dateUtils.getWeekDays(weekRange.$gte);

      daysOfWeek.forEach((date) => {
        ManagerNotes.update({
          noteDate: TimeRangeQueryBuilder.forDay(date),
          'relations.areaId': areaId
        }, {
          $setOnInsert: {
            noteDate: date,
            relations: HospoHero.getRelationsObject(areaId)
          }
        }, {
          upsert: true
        })
      });

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
  }
});