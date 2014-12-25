Meteor.methods({
  'createJob': function(info) {
    if(!info.name) {
      throw new Meteor.Error(404, "Name field not found");
    }
    if(!info.activeTime) {
      throw new Meteor.Error(404, "Time field not found");
    }
    var doc = {
      "name": info.name,
      "type": info.type,
      "createdOn": Date.now(),
      "createdBy": null, //add logged in users id
      "refDate": new Date().toISOString().slice(0,10).replace(/-/g,"-"),
      "details": info.details,
      "image": info.image,
      "portions": info.portions,
      "activeTime": info.activeTime,
      "ingCost": info.ingCost,
      "shelfLife": info.shelfLife,
      "onshift": null,
      "status": 'draft',
      "assignedTo": null,
      "assignedBy": null
    }
    return Jobs.insert(doc);
  },

  'editJob': function(info) {
    if(!info._id) {
      throw new Meteor.Error(404, "Job id field not found");
    }
    if(!info.name) {
      throw new Meteor.Error(404, "Name field not found");
    }
    if(!info.activeTime) {
      throw new Meteor.Error(404, "Time field not found");
    }
    var doc = {
      "name": info.name,
      "type": info.type,
      "createdOn": Date.now(),
      "createdBy": null, //add logged in users id
      "refDate": new Date().toISOString().slice(0,10).replace(/-/g,"-"),
      "details": info.details,
      "image": info.image,
      "portions": info.portions,
      "activeTime": info.activeTime,
      "ingCost": info.ingCost,
      "shelfLife": info.shelfLife
    }
    console.log("Job updated", {"JobId": info._id});
    return Jobs.update({'_id': info._id}, {$set: doc});
  },

  'assignJobToShift': function(jobId, shiftId, jobStartTime) {
    if(!jobId) {
      throw new Meteor.Error(404, "Job id field not found");
    }
    var job = Jobs.findOne(jobId);
    if(!job) {
      throw new Meteor.Error(404, "Job not found");
    }
    var jobDoc = {};
    jobDoc.job = jobId;
    if(job.onshift) {
      if(job.status === 'assigned') {
        console.log("Job already on a shift, remove from shift", {"shiftId": job.onshift, "jobId": jobId});
        Shifts.update({"_id": job.onshift}, {$pull: {"jobs": jobDoc}});
      } else {
         throw new Meteor.Error(404, "Job on this state, cannot be moved: " + job.status);
      }
    }
    var status = null;
    //if shift Id exists job move to that shift
    //if does not remove from the shift
    if(shiftId) {
      var shift = Shifts.findOne(shiftId);
      if(!shift) {
        throw new Meteor.Error(404, "Shift not found");
      }
      if(jobStartTime) {
        jobDoc.start = jobStartTime;
      }
      console.log("Job set to the shift", {"shiftId": shiftId, "jobId": jobId});
      Shifts.update({"_id": shiftId}, {$addToSet: {"jobs": jobDoc}});
      status = "assigned";
    } else {
      status = "draft";
    }
    Jobs.update({"_id": jobId}, {$set: {"onshift": shiftId, "status": status}});
  },

  'setJobStatus': function(jobId) {
    if(!jobId) {
      throw new Meteor.Error(404, "Job id field not found");
    }
    var job = Jobs.findOne(jobId);
    if(!job) {
      throw new Meteor.Error(404, "Job not found");
    }
    if(!job.onshift) {
      throw new Meteor.Error(404, "Assign job to a shift before change status");
    }
    var status = null;
    if(job.status == "draft") {
      throw new Meteor.Error(404, "You can not have a draft job on a shift");
    } else if(job.status == "assigned") {
      status = "started";
    } else if(job.status == "started") {
      status = "finished";
    } else if(job.status == "finished") {
      throw new Meteor.Error(404, "You can not change status of a already finished job");
    }
    console.log("Job status set", {"jobId": jobId, "status": status});
    Jobs.update({"_id": jobId}, {$set: {"status": status}});
  }
});