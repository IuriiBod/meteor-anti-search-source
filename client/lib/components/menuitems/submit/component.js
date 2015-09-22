var component = FlowComponents.define('submitMenuItem', function(props) {
  this.onRendered(this.onFormRendered);
});

component.state.initialHTML = function() {
  return "Add instructions here";
};

component.action.submit = function(info) {
  Meteor.call("createMenuItem", info, function(err, id) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    }
    var options = {
      "type": "create",
      "title": "New Menu created"
    }
    Meteor.call("sendNotifications", id, "menu", options, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });    
    Router.go("menuItemDetail", {"_id": id});
  });
};

component.state.statuses = function() {
  return Statuses.find();
}

component.prototype.onFormRendered = function() {
  Session.set("localId", insertLocalMenuItem());
}

insertLocalMenuItem = function() {
  LocalMenuItem.remove({});
  return LocalMenuItem.insert({"ings": [], "preps": []});
}