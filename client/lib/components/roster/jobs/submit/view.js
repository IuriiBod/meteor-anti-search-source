Template.submitJob.events({
  'submit form': function(event, instance) {
    event.preventDefault();
    var type = $(event.target).find('[name=type]').val();
    var job = $(event.target).find('[name=name]').val();
    var portions = $(event.target).find('[name=portions]').val();
    var activeTime = $(event.target).find('[name=activeTime]').val();
    

    if(!job || job.trim() == "") {
      return alert("Please select a job from list");
    }
    var jobType = JobTypes.findOne(type);
    if(jobType && jobType.name == "Prep") {
      if(!portions || portions <= 0) {
        return alert("Please add no of portions you need");
      }
    }
    if(!job || job.trim() == "") {
      return alert("Please select a job from list");
    }
    
    var info = {
      type: type,
      ref: job
    };
    if(activeTime && activeTime.trim()) {
      info.activeTime = parseInt(activeTime.trim());
    }
    if(portions && portions.trim()) {
      info.portions = parseInt(portions.trim());
    }
    FlowComponents.callAction("submit", info);
  }
});

Template.submitJob.events({
  'change .jobType': function(event) {
    event.preventDefault();
    var type = $(event.target).val();
    $(".textTime").text("");
    FlowComponents.callAction("onChangeType", type);
  },

  'change .jobName': function(event) {
    event.preventDefault();
    var job = $(event.target).val();
    $(".textTime").text("");
    FlowComponents.callAction("onChangeJob", job);
  },

  'keyup .portions': function(event) {
    event.preventDefault();
    var portions = $(event.target).val();
    FlowComponents.callAction("keyup", portions);
  }
});
