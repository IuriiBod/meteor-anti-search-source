Meteor.methods({
  'createWorker': function(info) {
    if(!info.name) {
      logger.error("Worker should have a name");
      throw new Meteor.Error(404, "Worker should have a name");
    }
    var doc = {
      "name": info.name,
      "type": info.type,
      "createdOn": Date.now(),
      "createdBy": null, //add logged in users id
      "hourlyWage": info.wage,
      "workLimit": info.limit,
      "resign": false
    }
    var id = Workers.insert(doc);
    logger.info("Inserted new worker", {"id": id});
    return;
  },

  'editWorker': function(info) {
    if(!info._id) {
      logger.error("Worker id field not found");
      throw new Meteor.Error(404, "Worker id field not found");
    }
    var worker = Workers.findOne(info._id);
    if(!worker) {
      logger.error("Worker does not exist");
      throw new Meteor.Error(401, "Worker does not exist");
    }
    var updateDoc = {};
    if(info.name) {
      updateDoc.name = info.name;
    }
    if(info.type) {
      updateDoc.type = info.type;
    }
    if(info.wage) {
      updateDoc.hourlyWage = info.wage;
    }
    if(info.limit) {
      updateDoc.workLimit = info.limit;
    }
    if(Object.keys(updateDoc).length <= 0) {
      logger.error("Worker has nothing to be updated");
      throw new Meteor.Error(401, "Worker has nothing to be updated");
    }
    Workers.update({'_id': info._id}, {$set: updateDoc});
    logger.info("Edited worker details", {"Worker Id": info._id});
    return;
  },

  'deleteWorker': function(id) {
    if(!id) {
      logger.error("Worker id field not found")
      throw new Meteor.Error(404, "Worker id field not found");
    }
    var worker = Workers.findOne(id);
    if(!worker) {
      logger.error("Worker not found");
      throw new Meteor.Error(404, "Worker not found");
    }
    //if has past records on shifts, resign
    var alreadyAssigned = Shifts.find({"assignedTo": id}).count();
    if(alreadyAssigned > 0) {
      var todaysDate = new Date().toISOString().slice(0,10).replace(/-/g,"-");
      var assignedForFuture = Shifts.find({"shiftDate": {$gte: todaysDate}, "assignedTo": id}).count();
      if(assignedForFuture > 0) {
        Shifts.update({"shiftDate": {$gte: todaysDate}, "assignedTo": id}, {$set: {"assignedTo": null}}, {multi: true});
        logger.info("Removed worker from future assigned shifts", {"workerId": id, "date greater than": todaysDate});
      }
      Workers.update({'_id': id}, {$set: {"resign": true}});
      logger.info("Worker resigned - updated as resigned", {"workerId": id});
      return;
    } else {
      Workers.remove({'_id': id});
      logger.info("Worker deleted - resigned", {"workerId": id});
      return;
    }
  },

  'setLeave': function(workerId, date, onHoliday) {
    if(!workerId) {
      logger.error("WorkerId not found");
      throw new Meteor.Error(404, "WorkerId not found");
    }
    var worker = Workers.findOne(workerId);
    if(!worker) {
      logger.error("Worker does not exist");
      throw new Meteor.Error(404, "Worker does not exist");
    }
    if(!date) {
      logger.error("Date not found");
      throw new Meteor.Error(404, "Date not found");
    }
    if(onHoliday) {
      var alreadyAssigned = Shifts.findOne({"shiftDate": date, "assignedTo": workerId});
      if(alreadyAssigned) {
        logger.info("Worker removed from shift", {"workerId": workerId, "shift": alreadyAssigned._id});
        Shifts.update({_id: alreadyAssigned._id}, {$set: {"assignedTo": null}});
      }
      var entryExist = Holidays.findOne({"date": date});
      if(!entryExist) {
        var doc = {
          "date": date,
          "workers": []
        }
        doc.workers.push(workerId);
        var id = Holidays.insert(doc);
        logger.info("New Holiday entry inserted", {"workerId": workerId, "date": date, "id": id});
        return;
      } else {
        Holidays.update({"_id": entryExist._id}, {$addToSet: {"workers": workerId}});
        logger.info("Leave added: ", {"id": entryExist._id, "workerId": workerId});
        return;
      }
    } else {
      var entryExist = Holidays.findOne({"date": date});
      if(!entryExist) {
        logger.error("Holiday not found");
        throw new Meteor.Error(404, "Holiday not found");
      }
      Holidays.update({"_id": entryExist._id}, {$pull: {"workers": workerId}});
      logger.info("Leave removed: ", {"date": date, "workerId": workerId});
      return;
    }
  },

  'addWorkerType': function(type) {
    if(!type) {
      logger.error("Type field not found");
      throw new Meteor.Error("Type field not found");
    }
    var existingtype = WorkerTypes.findOne({'type': type});
    if(existingtype) {
      logger.error("Existing worker type");
      throw new Meteor.Error("Exsiting worker type");
    }
    logger.info("New worker type inserted", {"type": type});
    WorkerTypes.insert({'type': type});
  }
});