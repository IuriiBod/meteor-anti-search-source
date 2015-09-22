var component = FlowComponents.define("listOfJobItems", function(props) {
  this.name = props.name;
  this.id = props.id;
});

component.state.jobItemsList = function() {
  var localId = Session.get("localId");
  var ids = [];
  if(localId) {
    if(this.id == "menuSubmit") {
      var localMenuItem = LocalMenuItem.findOne(localId);
      if(localMenuItem && localMenuItem.preps.length > 0) {
        ids = localMenuItem.preps;
      }
    } 
  }
  Meteor.subscribe("jobItems", ids);
  return ids;
}

component.state.isMenu = function() {
  if(this.id == "menuSubmit") {
    return true;
  } else {
    return false;
  }
}

component.state.name = function() {
  return this.name;
}