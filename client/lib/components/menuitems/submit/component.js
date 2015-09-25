var component = FlowComponents.define('submitMenuItem', function(props) {
});

component.state.initialHTML = function() {
  return "Add instructions here";
};

component.action.submit = function(info) {
  Meteor.call("createMenuItem", info, function(err, id) {
    if(err) {
      HospoHero.alert(err);
    }
    Session.set("selectedIngredients", null);
    Session.set("selectedJobItems", null);
    Router.go("menuItemDetail", {"_id": id});
  });
};

component.state.statuses = function() {
  return Statuses.find();
};
