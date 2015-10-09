var component = FlowComponents.define("createLocation", function(props) {
  this.set('organizationId', props.organizationId);
  this.set('enabled', true);
});

component.action.changeEnable = function() {
  this.set('enabled', !this.get('enabled'));
};

component.action.submit = function(doc) {
  Meteor.call("createLocation", doc, function (err) {
    if(err) {
      HospoHero.alert(err);
    }
  });
};
