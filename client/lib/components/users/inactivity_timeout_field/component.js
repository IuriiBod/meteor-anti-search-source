var component = FlowComponents.define("inactivityTimeoutField", function () {

});

component.action.valueChange = function (value) {
  var areaId = HospoHero.getDefaultArea();
  Meteor.call('updateAreaInactivityTimeout', areaId, value);
};
