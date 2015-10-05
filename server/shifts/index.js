Meteor.methods({
  'createShift': function(info) {
    if(!HospoHero.perms.canUser('editRoster')()) {
      logger.error(403, "User not permitted to create shifts");
    }

    var shiftDate = new Date(info.shiftDate).getTime();
    var startTime = new Date(info.startTime).getTime();
    var endTime = new Date(info.endTime).getTime();
    if(startTime && endTime) {
      if(startTime > endTime) {
        logger.error("Start and end times invalid");
        throw new Meteor.Error("Start and end times invalid");
      }
    }
    var type = null;
    if(info.hasOwnProperty("type")) {
      type = info.type;
    }

    var doc = {
      "startTime": startTime,
      "endTime": endTime,
      "shiftDate": shiftDate,
      "section": info.section,
      "createdBy": Meteor.userId(), //add logged in users id
      "assignedTo": null, //update
      "assignedBy": null, //update
      "jobs": [],
      "status": "draft",
      "type": type,
      "published": false,
      relations: HospoHero.getRelationsObject()
    };
    if(info.hasOwnProperty("week") && info.week.length > 0) {
      var alreadyPublished = Shifts.findOne({
        "shiftDate": {$in: info.week},
        "published": true,
        "relations.areaId": HospoHero.getCurrentAreaId()
      });
      if(alreadyPublished) {
        doc.published = true;
        doc['publishedOn'] = Date.now();
      }
    }
    
    if(info.assignedTo) {
      var alreadyAssigned = Shifts.findOne({"assignedTo": info.assignedTo, "shiftDate": shiftDate});
      if(!alreadyAssigned) {
        doc.assignedTo = info.assignedTo;
      } else {
        logger.error("Duplicating shift");
        throw new Meteor.Error(404, "Duplicating shift");
      }
    }

    var id = Shifts.insert(doc);
    logger.info("Shift inserted", {"shiftId": id, "date": info.shiftDate, "type": type});
    return id;
  },

  'editShift': function(id, info) {
    if(!HospoHero.perms.canUser('editRoster')()) {
      logger.error(403, "User not permitted to create shifts");
    }

    HospoHero.checkMongoId(id);
    check(info, Object);

    var shift = Shifts.findOne({_id: id});
    if(!shift) {
      logger.error("Shift not found");
      throw new Meteor.Error(404, "Shift not found");
    }

    var updateDoc = {};
    var startTime;
    var endTime;

    if(info.hasOwnProperty("startTime") && info.hasOwnProperty("endTime")) {
      startTime = new Date(info.startTime).getTime();
      endTime = new Date(info.endTime).getTime();
      if(startTime && endTime) {
        if(startTime >= endTime) {
          logger.error("Start and end times invalid");
          throw new Meteor.Error(404, "Start and end times invalid");
        } else {
          updateDoc.startTime = new Date(info.startTime).getTime();
          updateDoc.endTime = new Date(info.endTime).getTime();
        }
      }  
    } else if(info.hasOwnProperty("startTime")) {
      startTime = new Date(info.startTime).getTime();
      endTime = new Date(shift.endTime).getTime();

      if(startTime && endTime) {
        if(startTime > endTime) {
          logger.error("Start time invalid");
          throw new Meteor.Error(404, "Start time invalid");
        } else {
          updateDoc.startTime = new Date(info.startTime).getTime();
        }
      }  
    } else if(info.hasOwnProperty("endTime")) {
      startTime = new Date(shift.startTime).getTime();
      endTime = new Date(info.endTime).getTime();

      if(startTime && endTime) {
        if(startTime > endTime) {
          logger.error("End time invalid");
          throw new Meteor.Error(404, "End time invalid");
        } else {
          updateDoc.endTime = new Date(info.endTime).getTime();
        }
      }  
    }
    if(info.hasOwnProperty("section")) {
      updateDoc.section = info.section;
    }

    if(info.shiftDate) {
      if(shift.shiftDate != new Date(info.shiftDate).getTime()) {
        if(shift.assignedTo) {
          var existingWorker = Shifts.findOne({"shiftDate": new Date(info.shiftDate).getTime(), "assignedTo": shift.assignedTo});

          if(existingWorker) {
            logger.error("The worker already has an assigned shift on this date ", {"id": info._id});
            throw new Meteor.Error(404, "The worker already has an assigned shift on this date");
          }
        } 
        updateDoc.shiftDate = new Date(info.shiftDate).getTime();
      }
    }
    if(info.assignedTo) {
      var date = null;
      if(updateDoc.shiftDate) {
        date = updateDoc.shiftDate;
      } else {
        date = shift.shiftDate;
      }
      var existInShift = Shifts.findOne({"shiftDate": date, "assignedTo": info.assignedTo});
      if(existInShift) {
        logger.error("User already exist in a shift", {"date": date});
        throw new Meteor.Error(404, "Worker has already been assigned to a shift");
      }
      var worker = Meteor.users.findOne(info.assignedTo);
      if(!worker) {
        logger.error("Worker not found");
        throw new Meteor.Error(404, "Worker not found");
      }
      updateDoc.assignedTo = info.assignedTo;
    }

    if(Object.keys(updateDoc).length <= 0) {
      logger.error("Shift has nothing to be updated");
      throw new Meteor.Error(401, "Shift has nothing to be updated");
    }

    Shifts.update({'_id': id}, {$set: updateDoc});
    logger.info("Shift details updated", {"shiftId": id});
  },

  'deleteShift': function(id) {
    if(!HospoHero.perms.canUser('editRoster')()) {
      logger.error(403, "User not permitted to create shifts");
    }

    HospoHero.checkMongoId(id);

    var shift = Shifts.findOne(id);
    if(!shift) {
      logger.error("Shift not found");
      throw new Meteor.Error(404, "Shift not found");
    }
    if(shift.assignedTo || shift.jobs.length > 0) {
      logger.error("Can't delete a shift with assigned worker or jobs", {"id": id});
      throw new Meteor.Error(404, "Can't delete a shift with assigned worker or jobs");
    }
    Shifts.remove({'_id': id});
    logger.info("Shift deleted", {"shiftId": id});
    return true;
  }
});