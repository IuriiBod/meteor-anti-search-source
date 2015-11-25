Meteor.methods({
  'assignJob': function (jobId, shiftId, startAt) {
    if (!jobId) {
      logger.error("Job id field not found");
      throw new Meteor.Error(404, "Job id field not found");
    }
    var job = Jobs.findOne(jobId);
    if (!job) {
      logger.error("Job does not exist", {"jobId": jobId});
      throw new Meteor.Error(404, "Job does not exist");
    }
    if (!(job.status === "draft" || job.status === "assigned")) {
      logger.error("Cannot assign a job in this status ", {"jobId": jobId, "status": job.status});
      throw new Meteor.Error(404, "Cannot assign a job in this status");
    }
    var updateDoc = {};
    if (job.onshift && !Shifts.findOne(job.onshift)) {
      logger.error("Shift not found");
      throw new Meteor.Error(404, "Shift not found");
    }
    if (shiftId) { //assign job
      var new_shift = Shifts.findOne(shiftId);
      if (!new_shift) {
        logger.error("Shift not found");
        throw new Meteor.Error(404, "Shift not found");
      }
      if (shiftId != job.onshift) {
        updateDoc.onshift = shiftId;
      }
      updateDoc.status = "assigned";
      updateDoc.options = {"assigned": new Date().getTime()}
      if (startAt) {
        var newDate = new Date(new_shift.shiftDate);

        var startAtDate = new Date(startAt);
        var starting = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), startAtDate.getHours(), startAtDate.getMinutes());

        updateDoc.startAt = new Date(starting).getTime();
      }

      //updating new shift
      Shifts.update({"_id": shiftId}, {$addToSet: {"jobs": jobId}});
      logger.info("Updated shift with assigned job", {"id": shiftId});
    } else { // remove assigned job
      if (job.status == "assigned") {
        updateDoc.onshift = null;
        updateDoc.status = "draft";
        updateDoc.options = {"draft": new Date()};
      } else {
        logger.error("Can not remove un-assigned job");
        throw new Meteor.Error(404, "Removing an un-assigned job");
      }
    }
    //updating job
    Jobs.update({"_id": jobId}, {$set: updateDoc});
    logger.info("Updated job as assigned", {"id": jobId});
  },

  'createNewJob': function (info) {
    if (!HospoHero.canUser('edit jobs', Meteor.userId())) {
      logger.error("User is not permitted to create jobs");
      throw new Meteor.Error(403, "User is not permitted to create jobs");
    }
    if (!info.ref) {
      logger.error("Job field not found");
      throw new Meteor.Error(404, "Job field not found");
    }
    if (!info.type) {
      logger.error("Job type field not found");
      throw new Meteor.Error(404, "Job type field not found");
    }
    var type = JobTypes.findOne({_id: info.type});

    if (!type) {
      logger.error("Job type not found");
      throw new Meteor.Error(404, "Job type not found");
    }
    if ((type.name == "Prep") && (!info.portions)) {
      logger.error("No of portions not found for prep type job");
      throw new Meteor.Error(404, "No of portions not found for prep type job");
    } else if ((type.type == "Recurring") && (!info.activeTime)) {
      logger.error("Active time not found for recurring type job");
      throw new Meteor.Error(404, "Active time not found for recurring type job");
    }
    var job = JobItems.findOne({"name": info.ref});
    if (!job) {
      logger.error("Job not found");
      throw new Meteor.Error(404, "Job not found");
    }

    var doc = {
      "ref": job._id,
      "type": info.type,
      "status": 'draft',
      "options": [],
      "onshift": null,
      "assignedTo": null,
      "createdOn": Date.now(),
      "createdBy": Meteor.userId(),
      relations: HospoHero.getRelationsObject()
    };
    doc.name = type.name + " " + job.name;
    if (type.name == "Prep") {
      doc.portions = info.portions;
      if (job.portions <= 0) {
        logger.error("No of portions recorded on job is 0. Fix it to create job with correct active time");
        throw new Meteor.Error(404, "No of portions recorded on job is 0. Fix it to create job with correct active time");
      }
      var time = parseInt((job.activeTime / job.portions) * info.portions);
      if (time == time) {
        doc.activeTime = time;
      } else {
        logger.error("Active time not valid");
        throw new Meteor.Error(404, "Active time not valid");
      }
    } else {
      doc.activeTime = parseInt(info.activeTime);
      doc.section = job.section;
      doc.startAt = job.repeatAt;
    }
    var id = Jobs.insert(doc);
    logger.info("Job inserted", {"jobId": id});
    return id;
  },

  'editJob': function (id, editFields) {
    if (!HospoHero.canUser('edit jobs', Meteor.userId())) {
      logger.error("User is not permitted to edit jobs");
      throw new Meteor.Error(403, "User is not permitted to edit jobs");
    }
    if (!id) {
      logger.error("Job id field not found");
      throw new Meteor.Error(404, "Job id field not found");
    }
    var job = Jobs.findOne(id);
    if (!job) {
      logger.error("Job does not exist", {"jobId": id});
      throw new Meteor.Error(404, "Job does not exist");
    }
    if (!editFields) {
      logger.error("No editing fields found");
      throw new Meteor.Error(404, "No editing fields found");
    }
    if (editFields.name == "") {
      logger.error("Name field null");
      throw new Meteor.Error(404, "You can't add empty name job");
    }
    if (editFields.activeTime == "") {
      logger.error("Active time field null");
      throw new Meteor.Error(404, "You can't add empty active time");
    }
    logger.info("Job updated", {"JobId": id});
    return Jobs.update({'_id': id}, {$set: editFields});
  },

  'deleteJob': function (id, shiftId) {
    if (!HospoHero.canUser('edit jobs', Meteor.userId())) {
      logger.error("User is not permitted to delete jobs");
      throw new Meteor.Error(403, "User is not permitted to delete jobs");
    }
    if (!id) {
      logger.error("Job id field not found");
      throw new Meteor.Error(404, "Job id field not found");
    }
    var job = Jobs.findOne(id);
    if (!job) {
      logger.error("Job not found", {"jobId": id});
      throw new Meteor.Error(404, "Job not found");
    }
    if (job.status == "draft") {
      logger.info("Job removed", {"jobId": id});
      Jobs.remove({'_id': id});
    } else {
      if (job.status == "assigned") {
        if (shiftId) {
          var shift = Shifts.findOne(shiftId);
          if (shift) {
            Shifts.update({'_id': shiftId}, {$pull: {"jobs": id}});
            logger.info("Removed job from shift");
          }
        }
        logger.info("Job set back to draft state - not deleted", {"jobId": id});
        Jobs.update({'_id': id}, {$set: {"status": "draft", "onshift": null}});
      } else {
        logger.error("Job is in active stage, can't delete", {"JobId": id, "State": job.status});
        throw new Meteor.Error(404, "Job in '" + job.status + "' status cannot be deleted");
      }
    }
  },

  'addJobType': function (type) {
    if (!HospoHero.canUser('edit jobs', Meteor.userId())) {
      logger.error("User is not permitted to create job types");
      throw new Meteor.Error(403, "User is not permitted to create job types");
    }
    if (!type) {
      logger.error("Job type field not found");
      throw new Meteor.Error("Job type field not found");
    }
    var existingtype = JobTypes.findOne({
      'type': type,
      "relations.areaId": HospoHero.getCurrentAreaId()
    });
    if (existingtype) {
      logger.error("Existing job type");
      throw new Meteor.Error("Exsiting job type");
    }
    logger.info("New job type inserted ", {"type": type});
    JobTypes.insert({'type': type});
  },

  'changeJobStatus': function (jobId, state) {
    if (!HospoHero.canUser('edit jobs', Meteor.userId())) {
      logger.error("User is not permitted to change job status");
      throw new Meteor.Error(403, "User is not permitted to change job status");
    }

    if (!jobId) {
      logger.error("Job id field not found");
      throw new Meteor.Error(404, "Job id field not found");
    }
    if (!state) {
      logger.error("Update State field not found");
      throw new Meteor.Error(404, "Update State field not found");
    }
    var job = Jobs.findOne(jobId);
    if (!job) {
      logger.error("Job not found");
      throw new Meteor.Error(404, "Job not found");
    }
    if (!job.onshift) {
      logger.error("Assign job to a shift before changing status");
      throw new Meteor.Error(404, "Assign job to a shift before change status");
    }
    var updateStatus = null;
    var currentStatus = job.status;
    var options = job.options;
    //start, state to started
    if (currentStatus == "assigned") {
      if (state == "start") {
        updateStatus = "started";
      } else {
        logger.error("Invalid state change ", {"currnet": currentStatus, "changeTo": state});
        throw new Meteor.Error(404, "Invalid state change");
      }
    } else if (currentStatus == "started") {
      if (state == "pause") {
        updateStatus = "paused";
      } else if (state == "cooking") {
        updateStatus = "cooking";
      } else if (state == "finish") {
        updateStatus = "finished";
      } else {
        logger.error("Invalid state change ", {"currnet": currentStatus, "changeTo": state});
        throw new Meteor.Error(404, "Invalid state change");
      }
    } else if (currentStatus == "cooking") {
      if (state == "pause") {
        updateStatus = "paused";
      } else if (state == "finish") {
        updateStatus = "finished";
      } else {
        logger.error("Invalid state change ", {"currnet": currentStatus, "changeTo": state});
        throw new Meteor.Error(404, "Invalid state change");
      }
    } else if (currentStatus == "paused") {
      if (state == "start") {
        updateStatus = "started";
      } else if (state == "cooking") {
        updateStatus = "cooking";
      } else if (state == "finish") {
        updateStatus = "finished";
      } else {
        logger.error("Invalid state change ", {"currnet": currentStatus, "changeTo": state});
        throw new Meteor.Error(404, "Invalid state change");
      }
    } else {
      logger.error("Invalid state change ", {"currnet": currentStatus, "changeTo": state});
      throw new Meteor.Error(404, "Invalid state change");
    }

    options[updateStatus] = new Date();

    logger.info("Job status updated", {"jobId": jobId, "status": updateStatus, "options": options});
    Jobs.update({"_id": jobId}, {$set: {"status": updateStatus, "options": options}});
    //if finished, add portions to inventory
    if (updateStatus == "finished") {
      logger.info("Inventory update ", {"jobId": jobId, "portions": job.portions});
      //add inventory update here (Not designed yet)
    }
  }
});
