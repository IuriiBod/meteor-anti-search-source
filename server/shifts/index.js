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
    order: Match.Optional(Number),
    relations: Match.Optional(HospoHero.checkers.Relations)
  });


  //check if worker already assigned
  if (shift.startTime.getTime() > shift.endTime.getTime()) {
    logger.error("Start and end times invalid");
    throw new Meteor.Error("Start and end times invalid");
  }

  if (shift.assignedTo) {
    var assignedWorker = Meteor.users.findOne({_id: info.assignedTo});
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


var logShiftUpdate = function (newShift, userId) {
  if (newShift.assignedTo) {
    var oldShift = Shifts.findOne({_id: newShift._id});

    if (oldShift.assignedTo != newShift.assignedTo && newShift.published) {
      //add shift update
      var updateText = "You have been assigned to shift dated <b>" +
        HospoHero.dateUtils.intervalDateFormat(newShift.startTime, newShift.endTime) + "</b>";

      var updateDocument = {
        to: newShift.assignedTo,
        userId: userId,
        shiftId: oldShift._id,
        text: updateText,
        locationId: HospoHero.getCurrentArea(userId).locationId,
        type: "update"
      };

      logger.info("Shift update insert");
      ShiftsUpdates.insert(updateDocument);
    }
  }
};


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

    logShiftUpdate(updatedShift, userId);

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