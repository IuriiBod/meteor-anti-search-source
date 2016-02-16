CalendarHooksManager = class CalendarHooksManager {
  constructor(userId, oldItem, newItem, itemSettings) {
    this.userId = userId;
    this.area = HospoHero.getCurrentArea(userId);
    this.oldItem = oldItem;
    this.newItem = newItem;
    this.itemSettings = itemSettings;
  }

  _time(timeSettings) {
    let oldTime = {
      start: this.oldItem[timeSettings.start],
      end: this.oldItem[timeSettings.end]
    };

    let newTime = {
      start: this.newItem[timeSettings.start],
      end: this.newItem[timeSettings.end]
    };

    if (oldTime.start !== newTime.start || oldTime.end !== newTime.end) {
      this._shiftExistsAndTimeChecker(oldTime, newTime);

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

  _assignedTo(settings) {
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
      let event = {
        itemId: this.newItem._id,
        startTime: this.newItem.startTime,
        endTime: this.newItem.endTime,
        type: settings.type,
        userId: settings.value,
        locationId: this.area.locationId,
        areaId: this.area._id
      };
      Meteor.call('addCalendarEvent', event);
    }
  }

  check() {
    let checkMethods = this.itemSettings.fieldsToCheck;

    _.extend(checkMethods, {
      oldItem: this.oldItem,
      newItem: this.newItem
    });

    _.keys(checkMethods).forEach((field) => {
      if (_.isFunction(checkMethods[field])) {
        this[`_${field}`](checkMethods[field]());
      }
    });
  }

  /**
   * Checks shift existing and edit or create it if needed
   * @param {Object} oldTime - start/end time of the item
   * @param {Date} oldTime.start - the start time of the item
   * @param {Date} oldTime.end - the end time of the item
   *
   * @param {Object} newTime - start/end time of the item
   * @param {Date} newTime.start - the start time of the item
   * @param {Date} newTime.end - the end time of the item
   * @private
   */
  _shiftExistsAndTimeChecker(oldTime, newTime) {
    // Check if the shift for updated item exists
    let shift = Shifts.findOne({
      startTime: TimeRangeQueryBuilder.forDay(oldTime.start, this.area.locationId),
      assignedTo: this.userId,
      'relations.areaId': this.area._id
    });

    if (!!shift) {
      // If the item start/end time lover/greater than shift start/end
      // time, update the shift time
      if (newTime.start < shift.startTime || newTime.end > shift.endTime) {
        if (newTime.start < shift.startTime) {
          shift.startTime = newTime.start;
        }

        if (newTime.end > shift.endTime) {
          shift.endTime = newTime.end;
        }

        Meteor.call('editShift', shift);
      }
    } else {
      //if there are no shift for today, create one
      Meteor.call('createShift', {
        type: null,
        startTime: newTime.start,
        endTime: newTime.end,
        assignedTo: this.userId
      });
    }
  }
};