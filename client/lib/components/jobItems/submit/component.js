LocalJobItem =  new Mongo.Collection(null);

var component = FlowComponents.define('submitJobItem', function(props) {
  this.onRendered(this.onFormRendered);
});

component.state.initialHTML = function() {
  var type = Session.get("jobType");
  if(type) {
    var jobType = JobTypes.findOne(type);
    if(jobType && jobType.name == "Prep") {
      return "Add recipe here";
    } 
  } else {
    return "Add description here";
  }
};

component.state.repeatAt = function() {
  return "8:00 AM";
};


component.state.startsOn = function() {
  return moment().format("YYYY-MM-DD");
};

component.state.endsOn = function() {
  return moment().add(7, 'days').format("YYYY-MM-DD");
};

component.state.week = function() {
  return ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"];
};

component.state.sections = function() {
  return Sections.find();
};

component.action.submit = function(info) {
  Meteor.call("createJobItem", info, HospoHero.handleMethodResult(function(id) {
    Session.set("selectedJobItems", null);
    Session.set("checklist", []);
    Router.go("jobItemDetailed", {"_id": id});
  }));
};

component.state.jobtypes = function() {
  return JobTypes.find();
};

component.prototype.onFormRendered = function() {
  Session.set("frequency", "Daily");
  Session.set("checklist", []);
  Session.set("localId", insertLocalJobItem());
};

insertLocalJobItem = function() {
  var typeId = Session.get("jobType");
  LocalJobItem.remove({});
  if(typeId) {
    var type = JobTypes.findOne(typeId);
    if(type && type.name == "Prep") {
      return LocalJobItem.insert({"type": typeId, "ings": []});
    }
  }
};