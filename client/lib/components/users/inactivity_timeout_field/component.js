var component = FlowComponents.define("inactivityTimeoutField", function () {});

component.action.valueChange = function (value) {
  var updatedArea = {
    _id: HospoHero.getCurrentAreaId(),
    inactivityTimeout: value
  };

  Meteor.call('editArea', updatedArea, HospoHero.handleMethodResult());
};
