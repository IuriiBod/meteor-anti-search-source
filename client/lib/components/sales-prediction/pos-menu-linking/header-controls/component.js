var component = FlowComponents.define('posMenuLinkingHeader', function (props) {
});

component.action.updatePosMenuItems = function () {
  Meteor.call('updatePosMenuItems', HospoHero.handleMethodResult());
};

component.action.syncActualSales = function () {
  Meteor.call('synchronizeActualSales', HospoHero.handleMethodResult());
};