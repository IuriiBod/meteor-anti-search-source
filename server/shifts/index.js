/**
 * Provides intelligent user notification about shift changes
 */
var ShiftPropertyChangeLogger = {
  trackedProperties: {
    startTime: 'start date and time',
    endTime: 'end time',
    assignedTo: 'assignment'
  },

  _formatProperty: function (shift, property) {
    var propertiesFormatters = {
      startTime: HospoHero.dateUtils.fullDateFormat,
      endTime: HospoHero.dateUtils.timeFormat,
      assignedTo: HospoHero.username
    };

    if (_.isDate(shift[property])) {
      return propertiesFormatters[property](shift[property], shift.relations.locationId);
    } else {
      return propertiesFormatters[property](shift[property]);
    }
  },

  _notificationTitle: function (shift) {
    return 'Update on shift dated ' + HospoHero.dateUtils.shiftDateInterval(shift);
  },

  _notificationChangeMessage: function (oldShift, newShift, propertyName) {
    return this.trackedProperties[propertyName] + ' has been updated to ' + this._formatProperty(newShift, propertyName);
  },

  _sendNotification: function (message, shift, fromUserId, toUserId) {
    var notificationText = this._notificationTitle(shift) + ': ' + message;

    var weekStartDateStr = HospoHero.dateUtils.getDateStringForRoute(shift.startTime, HospoHero.getCurrentArea().locationId);

    new NotificationSender(
      'Update on shift',
      'update-on-shift',
      {
        text: notificationText,
        shiftDate: weekStartDateStr
      },
      {
        helpers: {
          linkToItem: function () {
            return NotificationSender.urlFor('weeklyRoster', {date: this.shiftDate}, this);
          }
        }
      }
    ).sendNotification(toUserId);
  },

  _trackUserRemovedFromShift: function (oldShift, newShift, userId) {
    if (oldShift.assignedTo && oldShift.assignedTo !== newShift.assignedTo) {
      var message = 'You have been removed from this assigned shift';
      this._sendNotification(message, oldShift, userId, oldShift.assignedTo);
    }
  },

  trackChanges: function (newShift, userId) {
    if (newShift.published) {
      var oldShift = Shifts.findOne({_id: newShift._id});

      var isPropertyChanged = function (propertyName) {
        var oldPropertyValue = oldShift[propertyName];
        var newPropertyValue = newShift[propertyName];

        if (_.isDate(oldPropertyValue)) {
          oldPropertyValue = oldPropertyValue.valueOf();
          newPropertyValue = newPropertyValue.valueOf();
        }
        return oldPropertyValue !== newPropertyValue;
      };

      var self = this;
      var shiftChangesMessages = Object.keys(this.trackedProperties).filter(function (propertyName) {
        return isPropertyChanged(propertyName);
      }).map(function (propertyName) {
        return self._notificationChangeMessage(oldShift, newShift, propertyName);
      });

      var fullMessage = shiftChangesMessages.join(', ');
      this._sendNotification(fullMessage, oldShift, userId, newShift.assignedTo);

      this._trackUserRemovedFromShift(oldShift, newShift, userId);
    }
  }
};

let toCurrentDayMoment = (date, firstDayOfWeek) => {
  date = moment(date);
  // new Date(selectedWeek) for overcoming moment js deprecated error
  var selectedWeekMoment = moment(new Date(firstDayOfWeek));
  selectedWeekMoment.set({
    hours: date.hour(),
    minutes: date.minutes(),
    seconds: 0,
    day: date.day()
  });

  // The Crutch. Because of moment defaults week starts from Sunday
  if (date.day() === 0) {
    selectedWeekMoment.add(1, 'week');
  }
  return selectedWeekMoment.toDate();
};

/**
 * updates shift status if it needs to
 * @param updatedShift shift to adjust
 */
var adjustShiftStatus = function (updatedShift) {
  if (updatedShift.startedAt && updatedShift.status === 'draft') {
    updatedShift.status = 'started';
  }
  if (updatedShift.finishedAt && updatedShift.status !== 'finished') {
    updatedShift.status = 'finished';
  }
};

var canUserEditRoster = function(areaId = null) {
  var checker = new HospoHero.security.PermissionChecker();
  return checker.hasPermissionInArea(areaId, 'edit roster');
};

var getAreaIdFromShift = function (shiftId) {
  let shift = Shifts.findOne({_id: shiftId});
  return shift ? shift.relations.areaId : null;
};

/*
 * Shift modification methods
 */
Meteor.methods({
  createShift: function (newShiftInfo) {
    if (!canUserEditRoster()) {
      logger.error(403, "User not permitted to create shifts");
    }

    check(newShiftInfo, HospoHero.checkers.ShiftDocument);

    var shiftsCount = Shifts.find({startTime: TimeRangeQueryBuilder.forWeek(newShiftInfo.startTime)}).count();

    // publish new shift if other shifts of this week are published
    var isRosterPublished = !!Shifts.findOne({
      startTime: TimeRangeQueryBuilder.forWeek(newShiftInfo.startTime),
      published: true,
      "relations.areaId": HospoHero.getCurrentAreaId()
    });

    var defaultShiftProperties = {
      createdBy: Meteor.userId(),
      status: "draft",
      published: isRosterPublished,
      order: shiftsCount,
      relations: HospoHero.getRelationsObject()
    };

    var newShiftDocument = _.extend(newShiftInfo, defaultShiftProperties);

    if (isRosterPublished) {
      newShiftDocument.publishedOn = Date.now();
    }

    var createdShiftId = Shifts.insert(newShiftDocument);

    logger.info("Shift inserted", {
      shiftId: createdShiftId,
      date: newShiftInfo.startTime
    });

    return createdShiftId;
  },


  editShift: function (updatedShift) {
    check(updatedShift, HospoHero.checkers.ShiftDocument);

    if (!canUserEditRoster(getAreaIdFromShift(updatedShift._id))) {
      logger.error(403, "User not permitted to edit shifts");
    }

    ShiftPropertyChangeLogger.trackChanges(updatedShift, Meteor.userId());

    adjustShiftStatus(updatedShift);

    Shifts.update({'_id': updatedShift._id}, {$set: updatedShift});
    logger.info("Shift details updated", {"shiftId": updatedShift._id});
  },


  deleteShift: function (shiftToDeleteId) {
    check(shiftToDeleteId, HospoHero.checkers.MongoId);

    if (!canUserEditRoster(getAreaIdFromShift(shiftToDeleteId))) {
      logger.error(403, "User not permitted to delete shifts");
    }

    var shift = Shifts.findOne(shiftToDeleteId);

    if (shift) {
      if (shift.assignedTo) {
        logger.error("Can't delete a shift with assigned worker", {"id": shiftToDeleteId});
        throw new Meteor.Error(404, "Can't delete a shift with assigned worker");
      }

      Shifts.remove({_id: shiftToDeleteId});
      logger.info("Shift deleted", {"shiftId": shiftToDeleteId});
    }
  },

  copyShiftsFromTemplate(firstDayOfWeek, isConfirmed) {
    if (!canUserEditRoster()) {
      logger.error(403, "User not permitted to create shifts");
    }

    check(firstDayOfWeek, String);
    check(isConfirmed, Match.Optional(Boolean));

    let area = HospoHero.getCurrentArea(this.userId);
    let startAndEndOfWeek = TimeRangeQueryBuilder.forWeek(new Date(firstDayOfWeek), area.locationId);
    let existingShifts = Shifts.find({startTime: startAndEndOfWeek, 'relations.areaId': area._id});

    if (existingShifts.count() && isConfirmed === undefined) {
      throw new Meteor.Error(403, 'Shifts for selected week already exists!');
    } else if (existingShifts.count() && isConfirmed) {
      Shifts.remove({startTime: startAndEndOfWeek, 'relations.areaId': area._id});
    }

    let shiftsTypeTmpl = Shifts.find({
      type: 'template',
      'relations.areaId': HospoHero.getCurrentAreaId()
    });

    shiftsTypeTmpl.forEach(function (shift) {
      delete shift._id;
      shift.createdBy = Meteor.userId();
      shift.type = null;
      shift.startTime = toCurrentDayMoment(shift.startTime, firstDayOfWeek);
      shift.endTime = toCurrentDayMoment(shift.endTime, firstDayOfWeek);

      try {
        check(shift, HospoHero.checkers.ShiftDocument);
        Shifts.insert(shift);
      } catch(error) {
        console.log(error);
      }
    });
  }
});