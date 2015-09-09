var component = FlowComponents.define("submitJob", function(props) {
  this.onRendered(this.onJobRendered);
});

component.state.selectedJobType = function() {
  var jobType = this.get("type");
  return JobTypes.findOne(jobType);
}

component.state.jobTypes = function() {
  return JobTypes.find({"_id": {$nin: [this.get("type")]}});
};

component.state.jobs = function() {
  var jobType = this.get("type");
  if (!jobType) {
    return;
  }
  return JobItems.find({"type": jobType});
};

component.action.onChangeType = function(type) {
  this.set("type", type);
  this.set("jobRef", null);
  this.set("activeTime", null);
};

component.action.onChangeJob = function(job) {
  if(job) {
    this.set("jobRef", job);
  } else {
    this.set("jobRef", null);
  }
};

component.state.activeTime = function() {
  var jobId = this.get("jobRef");
  if(jobId) {
    var job = JobItems.findOne(jobId);
    if(job) {
      return job.activeTime;
    }
  } else {
    return 0;
  }
}

component.state.job = function() {
  var jobId = this.get("jobRef");
  if(jobId) {
    var job = JobItems.findOne(jobId);
    if(job) {
      this.set("activeTime", job.activeTime);
      return job;
    }
  }
};

component.action.keyup = function(portions) {
  var jobId = this.get("jobRef");
  if(jobId) {
    var job = JobItems.findOne(jobId);
    if(job) {
      var time = (job.activeTime/job.portions) * portions;
      this.set("activeTime", time);
    }
  }
};

component.state.isPrep = function() {
  var type = JobTypes.findOne(this.get("type"));
  if(type && type.name == "Prep") {
    return true;
  } else {
    return false;
  }
};

component.state.activeTimes = function() {
  var type = JobTypes.findOne(this.get("type"));
  if(type && type.name == "Prep") {
    var miliSeconds = parseInt(this.get("activeTime")) * 1000;
    var hours = moment.duration(miliSeconds).hours();
    var minutes = moment.duration(miliSeconds).minutes();
    var seconds = moment.duration(miliSeconds).seconds();
    var text = "";
    if(hours > 0) {
      text = hours + " hours ";
    }
    if(minutes > 0) {
      text += minutes + " minutes ";
    }
    if(seconds > 0) {
      text += seconds + " seconds";
    }
    return text;
  }
};

component.prototype.onJobRendered = function() {
  var prep = JobTypes.findOne({"name": "Prep"});
  if(prep) {
    this.set("type", prep._id);
    this.set("activeTime", 0);  
  }

  var config = {
    '.chosen-select'           : {},
    '.chosen-select-deselect'  : {allow_single_deselect:true},
    '.chosen-select-no-single' : {disable_search_threshold:10},
    '.chosen-select-no-results': {no_results_text:'Oops, nothing found!'}
  }
  for (var selector in config) {
    $(selector).chosen(config[selector]);
  }
};

component.action.submit = function(info) {
  var self = this;
  Meteor.call("createNewJob", info, function(err, id) {
    if(err) {
      return alert(err.reason);
    } else {
      var prep = JobTypes.findOne({"name": "Prep"});
      self.set("type", prep._id);
      $("input").val(0);
      $('select').prop('selectedIndex', 0);
      self.set("activeTime", 0);
      $("#submitJobModal").modal("hide");
    }
  });
};