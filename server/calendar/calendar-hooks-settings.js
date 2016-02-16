/**
 * The object with settings, passed into calendarHooksManager.
 *
 * collection - the string name of the collection to check
 *
 * fieldsToCheck - an object with functions that passed into
 *   a check function with the same name in calendarHooksManager.
 *   Must return a settings for calendarHooksManager check function.
 *
 * @type {Array}
 */
let collectionHooksSettings = [
  // Meetings checker
  {
    collection: 'meetings',
    fieldsToCheck: {
      time() {
        return {
          start: 'startTime',
          end: 'endTime'
        }
      },

      assignedTo() {
        return {
          type: 'meeting',
          field: 'accepted',
          value: HospoHero.misc.arrayDifference(this.oldItem.accepted, this.newItem.accepted)[0]
        };
      }
    }
  }
];

// Set hooks on startup
Meteor.startup(() => {
  collectionHooksSettings.forEach((collectionHook) => {
    Mongo.Collection.get(collectionHook.collection).after.update(function (userId, newItem) {
      let oldItem = this.previous;
      let checker = new CalendarHooksManager(oldItem, newItem, collectionHook);
      checker.check();
    })
  });
});