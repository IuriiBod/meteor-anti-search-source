/**
 * Provides intelligent user notification about shift changes
 */
var ShiftPropertyChangeLogger = {
  trackedProperties: {
    startTime: 'start time',
    endTime: 'end time',
    shiftDate: 'shift date',
    assignedTo: 'assignment'
  },

  propertiesFormatters: {
    startTime: HospoHero.dateUtils.timeFormat,
    endTime: HospoHero.dateUtils.timeFormat,
    shiftDate: HospoHero.dateUtils.shortDateFormat,
    assignedTo: HospoHero.username
  },

  _formatProperty: function (shift, property) {
    if(_.isDate(shift[property])) {
      return this.propertiesFormatters[property](shift[property], shift.relations.locationId);
    } else {
      return this.propertiesFormatters[property](shift[property]);
    }
  },

  _notificationTitle: function (shift) {
    return 'Update on shift dated ' + HospoHero.dateUtils.shiftDateInterval(shift);
  },

  _notificationChangeMessage: function (oldShift, newShift, propertyName) {
    return this.trackedProperties[propertyName] + ' has been updated to ' + this._formatProperty(newShift, propertyName);
  },

  _sendNotification: function (message, shift, fromUserId, toUserId) {
    var text = this._notificationTitle(shift) + ': ' + message;

    var updateDocument = {
      to: toUserId,
      userId: fromUserId,
      shiftId: shift._id,
      text: text,
      locationId: shift.relations.locationId,
      type: "update"
    };

    logger.info("Shift update insert");
    ShiftsUpdates.insert(updateDocument);

    HospoHero.sendNotification({
      type: 'shift',
      title: text,
      actionType: 'update',
      to: toUserId,
      ref: shift._id
    });
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


/*
 * Shift modification methods
 */
Meteor.methods({
  createShift: function (newShiftInfo) {
    if (!HospoHero.canUser('edit roster', Meteor.userId())) {
      logger.error(403, "User not permitted to create shifts");
    }

    check(newShiftInfo, HospoHero.checkers.ShiftDocument);

    var shiftsCount = Shifts.find({"shiftDate": TimeRangeQueryBuilder.forWeek(newShiftInfo.shiftDate)}).count();

    // publish new shift if other shifts of this week are published
    var isRosterPublished = !!Shifts.findOne({
      "shiftDate": TimeRangeQueryBuilder.forWeek(newShiftInfo.shiftDate),
      "published": true,
      "relations.areaId": HospoHero.getCurrentAreaId()
    });

    var defaultShiftProperties = {
      "createdBy": Meteor.userId(),
      "jobs": [],
      "status": "draft",
      "published": isRosterPublished,
      "order": shiftsCount,
      relations: HospoHero.getRelationsObject()
    };

    var newShiftDocument = _.extend(newShiftInfo, defaultShiftProperties);

    if (isRosterPublished) {
      newShiftDocument.publishedOn = Date.now();
    }

    var createdShiftId = Shifts.insert(newShiftDocument);

    logger.info("Shift inserted", {
      "shiftId": createdShiftId,
      "date": newShiftInfo.shiftDate
    });

    return createdShiftId;
  },


  editShift: function (updatedShift) {
    check(updatedShift, HospoHero.checkers.ShiftDocument);

    var userId = Meteor.userId();
    if (!HospoHero.canUser('edit roster', userId)) {
      logger.error(403, "User not permitted to edit shifts");
    }

    ShiftPropertyChangeLogger.trackChanges(updatedShift, userId);

    adjustShiftStatus(updatedShift);

    Shifts.update({'_id': updatedShift._id}, {$set: updatedShift});
    logger.info("Shift details updated", {"shiftId": updatedShift._id});
  },


  deleteShift: function (shiftToDeleteId) {
    check(shiftToDeleteId, HospoHero.checkers.MongoId);

    if (!HospoHero.canUser('edit roster', Meteor.userId())) {
      logger.error(403, "User not permitted to delete shifts");
    }

    var shift = Shifts.findOne(shiftToDeleteId);

    if (shift) {
      if (shift.assignedTo || shift.jobs.length > 0) {
        logger.error("Can't delete a shift with assigned worker or jobs", {"id": shiftToDeleteId});
        throw new Meteor.Error(404, "Can't delete a shift with assigned worker or jobs");
      }

      Shifts.remove({_id: shiftToDeleteId});
      logger.info("Shift deleted", {"shiftId": shiftToDeleteId});
    }
  }
});