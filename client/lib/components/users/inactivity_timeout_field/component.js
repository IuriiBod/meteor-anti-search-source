var component = FlowComponents.define("inactivityTimeoutField", function () {

});

component.action.valueChange = function (value) {
  var areaId = HospoHero.getCurrentAreaId();
  Meteor.call('updateAreaInactivityTimeout', areaId, value);
};
