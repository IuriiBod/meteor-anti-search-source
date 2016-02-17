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
        if (this.oldItem.startTime !== this.newItem.startTime || this.oldItem.endTime !== this.newValue.endTime) {
          return {
            start: 'startTime',
            end: 'endTime'
          }
        }
      },

      assignedTo() {
        let changedUser = HospoHero.misc.arrayDifference(this.oldItem.accepted, this.newItem.accepted)[0];
        if (changedUser) {
          return {
            type: 'meeting',
            field: 'accepted',
            value: changedUser
          };
        }
      }
    }
  },

  // Tasks checker
  {
    collection: 'taskList',
    fieldsToCheck: {
      duration() {
        return {
          time: 'dueDate',
          duration: 'duration',
          durationTimeUnit: 'minutes'
        }
      }
    }
  }
];


// Set hooks on startup
Meteor.startup(() => {
  collectionHooksSettings.forEach((collectionHook) => {
    Mongo.Collection.get(collectionHook.collection).after.update(function (userId, newItem) {
      let oldItem = this.previous;
      let checker = new CalendarHooksManager(userId, oldItem, newItem, collectionHook);
      checker.check();
    });

    Mongo.Collection.get(collectionHook.collection).after.remove(function (userId, item) {
      CalendarEvents.remove({itemId: item._id});
    });

    CalendarEvents.before.insert(function (userId, event) {
      let checker = new CalendarHooksManager(userId, event, event, {
        collection: 'calendarEvents',
        fieldsToCheck: {
          shiftExistsAndTimeChecker() {
            return {
              start: event.startTime,
              end: event.endTime
            }
          }
        }
      });
      checker.check();
    });
  });
});