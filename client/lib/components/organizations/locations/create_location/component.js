var component = FlowComponents.define("createLocation", function(props) {
  this.set('organizationId', props.organizationId);
  this.set('enabled', true);
});

component.action.changeEnable = function() {
  this.set('enabled', !this.get('enabled'));
};

component.action.checkExists = function(orgId, name) {
  var count = Locations.find({organizationId: orgId, name: name}).count();
  if(count > 0) {
    alert("The location with name " + name + " already exists!");
    return false;
  }
  return true;
};

component.action.submit = function(doc) {
  Meteor.call("createLocation", doc, function (err) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    }
  });
};
