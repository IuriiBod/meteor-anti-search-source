Meteor.publishComposite('calendarEvents', function (date, queryType, areaId, userId) {
  queryType = HospoHero.calendar.getQueryType(queryType);
  let area = Areas.findOne({_id: areaId});

  return {
    // shifts publishing
    find: function () {
      if (this.userId && !!area) {
        var query = {
          startTime: TimeRangeQueryBuilder[queryType](date, area.locationId),
          //published: true,
          'relations.areaId': areaId
        };

        if (userId) {
          query.assignedTo = userId;
        }

        return Shifts.find(query);
      } else {
        this.ready();
      }
    },

    children: [
      {
        // events publication
        find: function (shift) {
          return CalendarEvents.find({
            shiftId: shift._id
          });
        }
      },
      {
        find: function (shift) {
          let fields = HospoHero.security.getPublishFieldsFor('users', {});
          return Meteor.users.find({_id: shift.assignedTo}, {fields});
        }
      }
    ]
  }
});