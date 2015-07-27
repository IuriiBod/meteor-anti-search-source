var component = FlowComponents.define("stockCounting", function(props) {});

component.state.list = function() {
  var gareaId = Session.get("activeGArea");
  var sareaId = Session.get("activeSArea");
  var list = SpecialAreas.findOne({"_id": sareaId, "generalArea": gareaId});
  if(list) {
    if(list.stocks && list.stocks.length > 0) {
      subs.subscribe("ingredients", list.stocks);
    }
    return list.stocks;
  }
}

component.state.date = function() {
  return Date.now();
}

component.state.filtered = function() {
  return Session.get("activeSArea");
}