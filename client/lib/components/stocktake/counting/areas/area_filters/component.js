var component = FlowComponents.define("areaFilters", function(props) {
  this.onRendered(this.onListRendered);
});

component.state.generalAreas = function() {
  var main = StocktakeMain.findOne(Session.get("thisVersion"));
  if(main && main.orderReceipts && main.orderReceipts.length > 0) {
    var gareas = main.generalAreas;
    return GeneralAreas.find({"_id": {$in: gareas}}, {sort: {"createdAt": 1}});
  } else {
    return GeneralAreas.find({"active": true}, {sort: {"createdAt": 1}});
  }
}

component.state.ifGAreaExists = function() {
  if(Session.get("activeGArea")) {
    return true;
  } else {
    return false;
  }
}

component.state.specialAreas = function(gareaId) {
  var main = StocktakeMain.findOne(Session.get("thisVersion"));
  if(main && main.orderReceipts && main.orderReceipts.length > 0) {
    var sareas = main.specialAreas;
    return SpecialAreas.find({"_id": {$in: sareas}, "generalArea": gareaId}, {sort: {"createdAt": 1}});
  } else {
    return SpecialAreas.find({"generalArea": gareaId, "active": true}, {sort: {"name": 1}});
  }
}

component.state.editable = function() {
  return Session.get("editStockTake");
}

component.prototype.onListRendered = function() {
  var garea = GeneralAreas.findOne({}, {sort: {"createdAt": 1}});
  if(garea && !Session.get("activeGArea")) {
    Session.set("activeGArea", garea._id);
    Session.set("activeSArea", null);
  }

}