Meteor.methods({
  'createShift': function(info) {
    if(!HospoHero.canUser('edit roster')()) {
      logger.error(403, "User not permitted to create shifts");
    }

    var shiftDate = HospoHero.dateUtils.shiftDate(info.shiftDate);
    var startTime = new Date(info.startTime);
    var endTime = new Date(info.endTime);
    if(startTime && endTime) {
      if(startTime.getTime() > endTime.getTime()) {
        logger.error("Start and end times invalid");
        throw new Meteor.Error("Start and end times invalid");
      }
    }
    var type = null;
    if(info.hasOwnProperty("type")) {
      type = info.type;
    }

    var order = 0;
    if(info.hasOwnProperty(order)) {
      order = parseFloat(info.order);
    } else {
      var shifts = Shifts.find({"shiftDate": shiftDate}).fetch();
      if(shifts) {
        order = shifts.length;
      }
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
      "order": order,
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
    if(!HospoHero.canUser('edit roster')()) {
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
    var startTime = info.hasOwnProperty("startTime") ? new Date(info.startTime) : new Date(shift.startTime);
    var endTime = info.hasOwnProperty("endTime") ? new Date(info.endTime) : new Date(shift.endTime);

    if(startTime.getTime() >= endTime.getTime()) {
      logger.error("Start or end time is invalid");
      throw new Meteor.Error(404, "Start and end times invalid");
    } else {
      updateDoc.startTime = startTime;
      updateDoc.endTime = endTime;
    }

    console.log('UPDAte', updateDoc);


    if(info.hasOwnProperty("section")) {
      updateDoc.section = info.section;
    }

    if(info.shiftDate) {
      if(shift.shiftDate.getTime() != new Date(info.shiftDate).getTime()) {
        var shiftDate = moment(info.shiftDate).startOf('day').toDate();
        if(shift.assignedTo) {
          var existingWorker = Shifts.findOne({"shiftDate": shiftDate, "assignedTo": shift.assignedTo});

          if(existingWorker) {
            logger.error("The worker already has an assigned shift on this date ", {"id": info._id});
            throw new Meteor.Error(404, "The worker already has an assigned shift on this date");
          }
        } 
        updateDoc.shiftDate = shiftDate;
      }
    }

    if(info.order) {
      updateDoc.order = parseFloat(info.order);
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

    if(Object.keys(updateDoc).length > 0) {
      Shifts.update({'_id': id}, {$set: updateDoc});
      logger.info("Shift details updated", {"shiftId": id});
    }
  },

  'deleteShift': function(id) {
    if(!HospoHero.canUser('edit roster')()) {
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