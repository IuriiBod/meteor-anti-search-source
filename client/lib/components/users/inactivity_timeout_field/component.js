var component = FlowComponents.define("inactivityTimeoutField", function () {
});

component.action.valueChange = function (value) {
  var area = Areas.findOne({_id: HospoHero.getCurrentAreaId()});
  area.inactivityTimeout = value * 60000;
  Meteor.call('editArea', area, HospoHero.handleMethodResult());
};
