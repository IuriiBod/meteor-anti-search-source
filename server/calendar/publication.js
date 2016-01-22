Meteor.publishComposite('calendarEvents', function (date, locationId, userId) {
  return {
    find: function () {
      if (this.userId) {
        var query = {
          date: TimeRangeQueryBuilder.forWeek(date, locationId)
        };

        if (userId) {
          query.userId = userId;
        }

        return CalendarEvents.find(query);
      } else {
        this.ready();
      }
    },

    children: [
      {
        find: function (event) {
          var itemCollections = {
            'recurring job': JobItems
          };

          return itemCollections[event.type].find({_id: event.itemId});
        }
      }
    ]
  }
});