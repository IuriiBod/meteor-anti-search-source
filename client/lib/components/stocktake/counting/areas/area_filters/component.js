var component = FlowComponents.define("areaFilters", function(props) {
  this.onRendered(this.onListRendered);
});

component.state.generalAreas = function() {
  var main = StocktakeMain.findOne(Session.get("thisVersion"));
  if(main && main.orderReceipts && main.orderReceipts.length > 0) {
    var gareas = main.generalAreas;
    return GeneralAreas.find({"_id": {$in: gareas}});
  } else {
    return GeneralAreas.find({"active": true});
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
    return SpecialAreas.find({"_id": {$in: sareas}});
  } else {
    return SpecialAreas.find({"generalArea": gareaId, "active": true});
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