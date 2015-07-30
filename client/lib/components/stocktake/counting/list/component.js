var component = FlowComponents.define("stockCounting", function(props) {
  var route = Router.current().params.date;
  if(route == "new") {
    route = moment().format("YYYY-MM-DD");
  }
  this.date = new Date(route).getTime();

});

component.state.list = function() {
  var gareaId = Session.get("activeGArea");
  var sareaId = Session.get("activeSArea");
  var list = SpecialAreas.findOne({"_id": sareaId, "generalArea": gareaId});
  if(list) {
    if(list.stocks && list.stocks.length > 0) {
    }
    return list;
  }
}

component.state.date = function() {
  return this.date;
}

component.state.filtered = function() {
  return Session.get("activeSArea");
}