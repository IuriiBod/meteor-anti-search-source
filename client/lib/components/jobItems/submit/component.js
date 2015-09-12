LocalJobItem =  new Mongo.Collection(null);

var component = FlowComponents.define('submitJobItem', function(props) {
  this.onRendered(this.onFormRendered);
});

component.state.initialHTML = function() {
  var type = Session.get("jobType");
  var jobType = JobTypes.findOne(type);

  if(jobType && jobType.name == "Prep") {
    return "Add recipe here";
  } else {
    return "Add description here";
  }
};

component.state.step = function() {
  return 2;
};

component.state.repeatAt = function() {
  return "8:00 AM";
};


component.state.startsOn = function() {
  return moment().format("YYYY-MM-DD");
};

component.state.endsOn = function() {
  var endDate = moment().add(7, 'days').format("YYYY-MM-DD");
  return endDate;
};

component.state.week = function() {
  var week = ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"];
  return week;
};

component.state.sections = function() {
  return Sections.find();
};

component.action.submit = function(info) {
  Meteor.call("createJobItem", info, function(err, id) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    } else {
      Session.set("selectedIngredients", null);
      Session.set("selectedJobItems", null);
      var options = {
        type: "create",
        title: "New Job created"
      };
      Meteor.call("sendNotifications", id, "job", options, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
      
      Session.set("checklist", []);
      Router.go("jobItemDetailed", {"_id": id});
    }
  });
};

component.state.jobtypes = function() {
  return JobTypes.find();
}

component.prototype.onFormRendered = function() {
  var prep = JobTypes.findOne({"name": "Prep"});
  if(prep) {
    Session.set("jobType", prep._id);
  }
  Session.set("frequency", "Daily");
  Session.set("checklist", []);
  Session.set("localId", insertLocalJobItem());
}

insertLocalJobItem = function() {
  var typeId = Session.get("jobType");
  LocalJobItem.remove({});
  if(typeId) {
    var type = JobTypes.findOne(typeId);
    if(type && type.name == "Prep") {
      return LocalJobItem.insert({"type": typeId, "ings": []});
    }
  }
}
