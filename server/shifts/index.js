Meteor.methods({
  'createShift': function(info) {
    var user = Meteor.user();
    if(!user) {
      logger.error("No logged in user");
      throw new Meteor.Error(404, "No logged in user");
    }
    var permitted = isManagerOrAdmin(user);
    if(!permitted) {
      logger.error("User not permitted to create shifts");
      throw new Meteor.Error(403, "User not permitted to create shifts");
    }
    if(!info.startTime) {
      logger.error("Start time not found");
      throw new Meteor.Error(404, "Start time not found");
    }
    if(!info.endTime) {
      logger.error("End time field not found");
      throw new Meteor.Error(404, "End time field not found");
    }
    if(!info.shiftDate) {
      logger.error("Date field not found");
      throw new Meteor.Error(404, "Date field not found");
    }
    // if(!info.section) {
    //   logger.error("Section field not found");
    //   throw new Meteor.Error(404, "Section field not found");
    // }
    var startTime = new Date(info.startTime).getTime();
    var endTime = new Date(info.endTime).getTime()
    if(startTime && endTime) {
      if(startTime > endTime) {
        logger.error("Start and end times invalid");
        throw new Meteor.Error(404, "Start and end times invalid");
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
      var shifts = Shifts.find({"shiftDate": new Date(info.shiftDate).getTime()}).fetch();
      if(shifts) {
        order = shifts.length;
      }
    }


    var doc = {
      "startTime": new Date(info.startTime).getTime(),
      "endTime": new Date(info.endTime).getTime(),
      "shiftDate": new Date(info.shiftDate).getTime(),
      "section": info.section,
      "createdBy": user._id, //add logged in users id
      "assignedTo": null, //update
      "assignedBy": null, //update
      "jobs": [],
      "status": "draft",
      "type": type,
      "published": false,
      "order": order
    }
    if(info.hasOwnProperty("week") && info.week.length > 0) {
      var alreadyPublished = Shifts.findOne({"shiftDate": {$in: info.week}, "published": true});
      if(alreadyPublished) {
        doc.published = true;
        doc['publishedOn'] = Date.now();
      }
    }
    // var yesterday = new Date();
    // yesterday.setDate(yesterday.getDate() - 1);
    // if(new Date(info.shiftDate) <= yesterday) {
    //   logger.error("Can not create a shift for a previous date");
    //   throw new Meteor.Error(404, "Can't create a shift for a previous date");
    // }
    
    if(info.assignedTo) {
      var alreadyAssigned = Shifts.findOne({"assignedTo": info.assignedTo, "shiftDate": new Date(info.shiftDate).getTime()});
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
    var user = Meteor.user();
    if(!user) {
      logger.error("No logged in user");
      throw new Meteor.Error(404, "No logged in user");
    }
    var permitted = isManagerOrAdmin(user);
    if(!permitted) {
      logger.error("User not permitted to edit shifts");
      throw new Meteor.Error(403, "User not permitted to edit shifts");
    }
    if(!id) {
      logger.error("Shift Id not found")
      throw new Meteor.Error(404, "Shift Id field not found");
    }
    var shift = Shifts.findOne(id);
    if(!shift) {
      logger.error("Shift not found");
      throw new Meteor.Error(404, "Shift not found");
    }
    var updateDoc = {};

    if(info.hasOwnProperty("startTime") && info.hasOwnProperty("endTime")) {
      var startTime = new Date(info.startTime).getTime();
      var endTime = new Date(info.endTime).getTime();
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
      var startTime = new Date(info.startTime).getTime();
      var endTime = new Date(shift.endTime).getTime();

      if(startTime && endTime) {
        if(startTime > endTime) {
          logger.error("Start time invalid");
          throw new Meteor.Error(404, "Start time invalid");
        } else {
          updateDoc.startTime = new Date(info.startTime).getTime();
        }
      }  
    } else if(info.hasOwnProperty("endTime")) {
      var startTime = new Date(shift.startTime).getTime();
      var endTime = new Date(info.endTime).getTime();

      if(startTime && endTime) {
        if(startTime > endTime) {
          logger.error("End time invalid");
          throw new Meteor.Error(404, "End time invalid");
        } else {
          updateDoc.endTime = new Date(info.endTime).getTime();
        }
      }  
    }

    // if(info.startTime) {
    //   updateDoc.startTime = new Date(info.startTime).getTime();
    // }
    // if(info.endTime) {
    //   updateDoc.endTime = new Date(info.endTime).getTime();
    // }
    if(info.hasOwnProperty("section")) {
      updateDoc.section = info.section;
    }

    
    // var yesterday = new Date();
    // yesterday.setDate(yesterday.getDate() - 1);
    // if(new Date(shift.shiftDate) <= yesterday) {
    //   logger.error("Can not edit shifts on previous days");
    //   throw new Meteor.Error(404, "Can not edit shifts on previous days");
    // }
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
    return;
  },

  'deleteShift': function(id) {
    var user = Meteor.user();
    if(!user) {
      logger.error("No logged in user");
      throw new Meteor.Error(404, "No logged in user");
    }
    var permitted = isManagerOrAdmin(user);
    if(!permitted) {
      logger.error("User not permitted to delete shifts");
      throw new Meteor.Error(403, "User not permitted to delete shifts ");
    }
    if(!id) {
      logger.error("Shift Id field not found");
      throw new Meteor.Error(404, "Shift Id field not found");
    }
    var shift = Shifts.findOne(id);
    if(!shift) {
      logger.error("Shift not found");
      throw new Meteor.Error(404, "Shift not found");
    }
    // var yesterday = new Date();
    // yesterday.setDate(yesterday.getDate() - 1);
    // if(new Date(shift.shiftDate) <= yesterday) {
    //   logger.error("Can not delete shifts on previous days");
    //   throw new Meteor.Error(404, "Can not delete shifts on previous days");
    // }
    if(shift.assignedTo || shift.jobs.length > 0) {
      logger.error("Can't delete a shift with assigned worker or jobs", {"id": id});
      throw new Meteor.Error(404, "Can't delete a shift with assigned worker or jobs");
    }
    Shifts.remove({'_id': id});
    logger.info("Shift deleted", {"shiftId": id});
    return;
  }
});