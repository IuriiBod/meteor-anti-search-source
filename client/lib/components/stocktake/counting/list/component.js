var component = FlowComponents.define("stockCounting", function(props) {
  this.version = Session.get("thisVersion");
});

component.state.editable = function() {
  return Session.get("editStockTake");
}

component.state.ordersExist = function() {
  var ordersExist = Stocktakes.findOne({
    "version": Session.get("thisVersion"),
    "status": true
  });
  if(ordersExist) {
    return true;
  } else {
    return false;
  }
}

component.state.version = function() {
  return this.version;
}

component.state.specialArea = function() {
  return Session.get("activeSArea");
}


component.state.generalArea = function() {
  return Session.get("activeGArea");
}

component.state.list = function() {
  var thisVersion = Session.get("thisVersion");
  var editable = Session.get("editStockTake");
  var gareaId = Session.get("activeGArea");
  var sareaId = Session.get("activeSArea");

  if(gareaId) {
    subs.subscribe("areaSpecificStocks", gareaId);
  }
  var list = Ingredients.find({"specialAreas": sareaId});
  if(list) {
    return list;
  }
}

component.state.stocktakeMain = function() {
  return StocktakeMain.findOne(this.version);
}

component.state.filtered = function() {
  return Session.get("activeSArea");
}