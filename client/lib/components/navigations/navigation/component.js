var component = FlowComponents.define("navigation", function(props) {});

component.state.isManagerOrAdmin = function() {
  return (HospoHero.isManager() || HospoHero.isAdmin());
};

component.state.category = function() {
  return Session.get("category") ? Session.get("category") : "all";
};

component.state.status = function() {
  return Session.get("status") ? Session.get("status") : "all";
};