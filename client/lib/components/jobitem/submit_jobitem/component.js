var component = FlowComponents.define('submitJobItem', function(props) {
});

component.state.initialHTML = function() {
  var type = Session.get("jobType");
  if(type == "Prep") {
    return "Add recipe here";
  } else {
    return "Add description here";
  }
};

component.state.repeatAt = function() {
  return "8:00 AM";
}


component.state.startsOn = function() {
  return moment().format("YYYY-MM-DD");
}

component.state.endsOn = function() {
  var endDate = moment().add(7, 'days').format("YYYY-MM-DD");
  return endDate;
}

component.state.week = function() {
  var week = ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"];
  return week;
}

component.state.sections = function() {
  var sections = ["Kitchen Hand", "Larder", "Baking", "Hot Section", "Pass"];
  return sections;
}

component.action.submit = function(info) {
  Meteor.call("createJobItem", info, function(err, id) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    } else {
      Session.set("selectedIngredients", null);
      Session.set("selectedJobItems", null);
      Router.go("jobItemDetailed", {"_id": id});
    }
  });
};