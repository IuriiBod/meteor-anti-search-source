CalendarHooksManager = class CalendarHooksManager {
  constructor(oldItem, newItem, itemSettings) {
    this.oldItem = oldItem;
    this.newItem = newItem;
    this.itemSettings = itemSettings;
  }

  check() {
    let checkMethods = this.itemSettings.fieldsToCheck;

    _.extend(checkMethods, {
      oldItem: this.oldItem,
      newItem: this.newItem
    });

    _.keys(checkMethods).forEach((field) => {
      if (_.isFunction(checkMethods[field])) {
        this[field](checkMethods[field]());
      }
    });
  }

  time(timeSettings) {
    let oldTime = {
      start: this.oldItem[timeSettings.start],
      end: this.oldItem[timeSettings.end]
    };

    let newTime = {
      start: this.newItem[timeSettings.start],
      end: this.newItem[timeSettings.end]
    };

    if (oldTime.start !== newTime.start || oldTime.end !== newTime.end) {
      CalendarEvents.find({
        itemId: this.newItem._id
      }).forEach((event) => {
        _.extend(event, {
          startTime: newTime.start,
          endTime: newTime.end
        });
        Meteor.call('editCalendarEvent', event);
      });
    }
  }

  assignedTo(settings) {
    let newFieldValue = this.newItem[settings.field];

    let isAssignedToRemoved = false;
    if (_.isString(newFieldValue)) {
      isAssignedToRemoved = settings.value !== newFieldValue;
    } else if (_.isArray(newFieldValue)) {
      isAssignedToRemoved = newFieldValue.indexOf(settings.value) === -1;
    }

    if (isAssignedToRemoved) {
      CalendarEvents.remove({itemId: this.newItem._id, userId: settings.value});
    } else {
      let area = HospoHero.getCurrentArea(Meteor.userId());
      let event = {
        itemId: this.newItem._id,
        startTime: this.newItem.startTime,
        endTime: this.newItem.endTime,
        type: settings.type,
        userId: settings.value,
        locationId: area.locationId,
        areaId: area._id
      };

      Meteor.call('addCalendarEvent', event)
    }
  }
}