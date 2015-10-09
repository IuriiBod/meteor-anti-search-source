var component = FlowComponents.define('submitMenuItem', function(props) {
  this.onRendered(this.onFormRendered);
});

component.state.initialHTML = function() {
  return "Add instructions here";
};

component.action.submit = function(info) {
  Meteor.call("createMenuItem", info, function(err, id) {
    if(err) {
      HospoHero.alert(err);
    }
    Router.go("menuItemDetail", {"_id": id});
  });
};

component.state.statuses = function() {
  return Statuses.find({
    name: {
      $ne: 'archived'
    }
  });
};

component.prototype.onFormRendered = function() {
  Session.set("localId", insertLocalMenuItem());
};

insertLocalMenuItem = function() {
  LocalMenuItem.remove({});
  return LocalMenuItem.insert({"ings": [], "preps": []});
};