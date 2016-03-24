Meteor.publishComposite('managerNotes', function (weekRange, areaId) {
  return {
    find: function() {
      check(areaId, HospoHero.checkers.MongoId);
      check(weekRange, HospoHero.checkers.WeekRange);

      //todo: any security checks here?

      let weekNotes = () => {
        return ManagerNotes.find({
          noteDate: weekRange,
          'relations.areaId': areaId
        });
      };

      let notes = weekNotes();

      if (notes.fetch().length >= 7) {
        return notes;
      }

      let daysOfWeek = HospoHero.dateUtils.getWeekDays(weekRange.$gte);

      daysOfWeek.forEach((date) => {
        let note = ManagerNotes.find({
          noteDate: date,
          'relations.areaId': areaId
        });

        if (!note.fetch().length) {
          ManagerNotes.insert({
            noteDate: date,
            relations: HospoHero.getRelationsObject(areaId)
          });
        }
      });

      return weekNotes();
    },
    children: [
      {
        find: function (note) {
          if (this.userId) {
            var query = {
              "reference": note._id,
              "relations.areaId": areaId
            };

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