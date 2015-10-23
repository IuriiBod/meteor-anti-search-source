Meteor.methods({
  'assignJob': function(jobId, shiftId, startAt) {
    if(!jobId) {
      logger.error("Job id field not found");
      throw new Meteor.Error(404, "Job id field not found");
    }
    var job = Jobs.findOne(jobId);
    if(!job) {
      logger.error("Job does not exist", {"jobId": jobId});
      throw new Meteor.Error(404, "Job does not exist");
    }
    if(!(job.status === "draft" || job.status === "assigned")) {
      logger.error("Cannot assign a job in this status ", {"jobId": jobId, "status": job.status});
      throw new Meteor.Error(404, "Cannot assign a job in this status");
    }
    var updateDoc = {};
    if(job.onshift && !Shifts.findOne(job.onshift)) {
      logger.error("Shift not found");
      throw new Meteor.Error(404, "Shift not found");
    }
    if(shiftId) { //assign job
      var new_shift = Shifts.findOne(shiftId);
      if(!new_shift) {
        logger.error("Shift not found");
        throw new Meteor.Error(404, "Shift not found");
      }
      if(shiftId != job.onshift) {
        updateDoc.onshift = shiftId;
      }
      updateDoc.status = "assigned";
      updateDoc.options = {"assigned": new Date().getTime()}
      if(startAt) {
        var newDate = new Date(new_shift.shiftDate);

        var startAtDate = new Date(startAt);
        var starting = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), startAtDate.getHours(), startAtDate.getMinutes());

        updateDoc.startAt = new Date(starting).getTime();
      }

      //updating new shift
      Shifts.update({"_id": shiftId}, {$addToSet: {"jobs": jobId}});
      logger.info("Updated shift with assigned job", {"id": shiftId});
    } else { // remove assigned job
      if(job.status == "assigned") {
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
  }
});