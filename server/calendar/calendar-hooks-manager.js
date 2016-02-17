CalendarHooksManager = class CalendarHooksManager {
  constructor(userId, oldItem, newItem, itemSettings) {
    this.userId = userId;
    this.area = HospoHero.getCurrentArea(userId);
    this.oldItem = oldItem;
    this.newItem = newItem;
    this.itemSettings = itemSettings;
  }

  /**
   * Checks the item start/end time
   * @param {Object} timeSettings - object with start/end time fields names
   * @param {String} timeSettings.start - start time field name
   * @param {String} timeSettings.end - end time field name
   * @private
   */
  _time(timeSettings) {
    if (timeSettings) {
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
  }

  /**
   * Checks time item settings with duration
   * @param {Object} durationSettings - settings object
   * @param {String} durationSettings.time - the name of field with start time
   * @param {String} durationSettings.duration - the name of field with duration
   * @param {String} durationSettings.durationTimeUnit - the name of the duration time unit
   * @private
   */
  _duration(durationSettings) {
    if (durationSettings) {
      let startEndTimeCreator = (itemObject) => {
        let itemTime = itemObject[durationSettings.time];

        _.extend(itemObject, {
          durationStart: itemTime,
          durationEnd: moment(itemTime).add(itemObject[durationSettings.duration], durationSettings.durationTimeUnit).toDate()
        });
      };

      startEndTimeCreator(this.oldItem);
      startEndTimeCreator(this.newItem);

      this._time({
        start: 'durationStart',
        end: 'durationEnd'
      });
    }
  }

  _assignedTo(settings) {
    if (settings) {
      let newFieldValue = this.newItem[settings.field];

      let isAssignedToRemoved = false;
      if (_.isString(newFieldValue)) {
        isAssignedToRemoved = settings.value !== newFieldValue;
      } else if (_.isArray(newFieldValue)) {
        isAssignedToRemoved = newFieldValue.indexOf(settings.value) === -1;
      }

      if (isAssignedToRemoved) {
        let eventsToRemoveQuery = {itemId: this.newItem._id, userId: settings.value};
        let eventToRemove = CalendarEvents.findOne(eventsToRemoveQuery);

        // check the length of events for current day
        if (CalendarEvents.find({shiftId: eventToRemove.shiftId}).count() === 1) {
          Shifts.remove({_id: eventToRemove.shiftId});
        }

        CalendarEvents.remove(eventsToRemoveQuery);
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
        shift.startTime = newTime.start;
        shift.endTime = newTime.end;
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

  check() {
    // if objects is not equal - check them
    if (JSON.stringify(this.oldItem) !== JSON.stringify(this.newItem)) {
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
  }
};