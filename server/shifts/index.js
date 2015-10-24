/**
 * Shift document checker
 */
var ShiftDocument = Match.Where(function (shift) {
  check(shift, {
    startTime: Date,
    endTime: Date,
    shiftDate: Date,
    type: Match.OneOf(String, null),

    //optional properties
    _id: Match.Optional(HospoHero.checkers.MongoId),
    section: HospoHero.checkers.OptionalMongoId,
    createdBy: HospoHero.checkers.OptionalMongoId,
    assignedTo: HospoHero.checkers.OptionalMongoId,
    assignedBy: HospoHero.checkers.OptionalMongoId,
    jobs: Match.Optional([HospoHero.checkers.MongoId]),
    status: Match.Optional(String),
    published: Match.Optional(Boolean),
    publishedOn: Match.Optional(Number),
    startedAt: Match.Optional(Number),
    finishedAt: Match.Optional(Number),
    order: Match.Optional(Number),
    relations: Match.Optional(HospoHero.checkers.Relations)
  });


  //check if worker already assigned
  if (shift.startTime.getTime() > shift.endTime.getTime()) {
    logger.error("Start and end times invalid");
    throw new Meteor.Error("Start and end times invalid");
  }

  if (shift.assignedTo) {
    var assignedWorker = Meteor.users.findOne({_id: shift.assignedTo});
    if (!assignedWorker) {
      logger.error("Worker not found");
      throw new Meteor.Error(404, "Worker not found");
    }

    var existInShift = !!Shifts.findOne({
      shiftDate: TimeRangeQueryBuilder.forDay(shift.shiftDate),
      assignedTo: shift.assignedTo
    });
    if (existInShift) {
      logger.error("User already exist in a shift", {"date": date});
      throw new Meteor.Error(404, "Worker has already been assigned to a shift");
    }
  }

  //specific checks for existing doc
  if (!!shift._id) {
    var shiftToUpdate = Shifts.findOne({_id: shift._id});

    if (!shiftToUpdate) {
      logger.error("Shift not found");
      throw new Meteor.Error(404, "Shift not found");
    }
  }

  return true;
});

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
    return this.propertiesFormatters[property](shift[property]);
  },

  _notificationTitle: function (shift) {
    return 'Update on shift dated ' + HospoHero.dateUtils.intervalDateFormat(shift.startTime, shift.endTime);
  },

  _notificationChangeMessage: function (oldShift, newShift, propertyName) {
    return this.trackedProperties[propertyName] + ' has been updated to ' + this._formatProperty(newShift, propertyName);
  },

  _sendNotification: function (message, shift, fromUserId) {
    var text = this._notificationTitle(shift) + ': ' + message;

    var updateDocument = {
      to: shift.assignedTo,
      userId: fromUserId,
      shiftId: shift._id,
      text: text,
      locationId: shift.relations.locationId,
      type: "update"
    };

    logger.info("Shift update insert");
    ShiftsUpdates.insert(updateDocument);
  },

  _trackUserRemovedFromShift: function (oldShift, newShift, userId) {
    if (oldShift.assignedTo && oldShift.assignedTo !== newShift.assignedTo) {
      var message = 'You have been removed from this assigned shift';
      this._sendNotification(message, oldShift, userId);
    }
  },

  trackChanges: function (newShift, userId) {
    if (newShift.published) {
      var oldShift = Shifts.findOne({_id: newShift._id});

      var isPropertyChanged = function (propertyName) {
        return oldShift[propertyName] !== newShift[propertyName];
      };

      var self = this;
      var shiftChangesMessages = Object.keys(this.trackedProperties).filter(function (propertyName) {
        return isPropertyChanged(propertyName);
      }).map(function (propertyName) {
        return self._notificationChangeMessage(oldShift, newShift, propertyName);
      });

      var fullMessage = shiftChangesMessages.join(', ');
      this._sendNotification(fullMessage, oldShift, userId);

      this._trackUserRemovedFromShift(oldShift, newShift, userId);
    }
  }
};


/*
 * Shift modification methods
 */
Meteor.methods({
  createShift: function (newShiftInfo) {
    check(ShiftDocument, newShiftInfo);

    if (!HospoHero.canUser('edit roster', Meteor.userId())) {
      logger.error(403, "User not permitted to create shifts");
    }

    var shiftsCount = Shifts.find({"shiftDate": TimeRangeQueryBuilder.forWeek(newShiftInfo.shiftDate)}).count();

    // publish new shift if other shifts of this week are published
    var isRosterPublished = !!Shifts.findOne({
      "shiftDate": TimeRangeQueryBuilder.forDay(newShiftInfo.shiftDate),
      "published": true,
      "relations.areaId": HospoHero.getCurrentAreaId()
    });

    var newShiftDocument = _.extend(newShiftInfo, {
      "section": newShiftInfo.section,
      "createdBy": Meteor.userId(),
      "assignedTo": null,
      "assignedBy": null,
      "jobs": [],
      "status": "draft",
      "type": type,
      "published": isRosterPublished,
      "order": shiftsCount,
      relations: HospoHero.getRelationsObject()
    });

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
    check(updatedShift, ShiftDocument);

    var userId = Meteor.userId();
    if (!HospoHero.canUser('edit roster', userId)) {
      logger.error(403, "User not permitted to create shifts");
    }

    ShiftPropertyChangeLogger.trackChanges(updatedShift, userId);

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