Meteor.publishComposite('calendarEvents', function (date, queryType, locationId, userId) {
  queryType = queryType === 'day' ? 'forDay' : 'forWeek';

  return {
    // shifts publishing
    find: function () {
      if (this.userId) {
        var query = {
          startTime: TimeRangeQueryBuilder[queryType](date, locationId),
          published: true
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
      }
    ]
  }
});