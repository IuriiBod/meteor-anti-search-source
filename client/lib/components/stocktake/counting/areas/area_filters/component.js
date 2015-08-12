var component = FlowComponents.define("areaFilters", function(props) {
  this.onRendered(this.onListRendered);
});

component.state.generalAreas = function() {
  var data = GeneralAreas.find({}, {sort: {"createdAt": 1}});
  return data;
}

component.state.ifGAreaExists = function() {
  if(Session.get("activeGArea")) {
    return true;
  } else {
    return false;
  }
}

component.state.specialAreas = function() {
  var id = Session.get("activeGArea");
  if(id) {
    return SpecialAreas.find({"generalArea": id}, {sort: {"createdAt": 1}});  
  }
}

component.state.editable = function() {
  return Session.get("editStockTake");
}

component.prototype.onListRendered = function() {
  var garea = GeneralAreas.findOne({}, {sort: {"createdAt": 1}});
  if(garea && !Session.get("activeGArea")) {
    Session.set("activeGArea", garea._id)
    if(garea.specialAreas && garea.specialAreas.length > 0) {
      var s = garea.specialAreas[0];
      Session.set("activeSArea", garea.specialAreas[0]);
    }
  }

}