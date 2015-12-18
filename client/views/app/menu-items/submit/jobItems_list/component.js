var component = FlowComponents.define("listOfJobItems", function (props) {
  this.name = props.name;
  this.id = props.id;
});

component.state.jobItemsList = function () {
  var localId = Session.get("localId");
  var ids = [];
  if (localId) {
    if (this.id == "menuSubmit") {
      var localMenuItem = LocalMenuItem.findOne(localId);
      if (localMenuItem && localMenuItem.preps.length > 0) {
        ids = localMenuItem.preps;
      }
    }
  }
  return ids;
};

component.state.isMenu = function () {
  return this.id == "menuSubmit";
};

component.state.name = function () {
  return this.name;
};