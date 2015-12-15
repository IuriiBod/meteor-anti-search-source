Template.menuListHeader.events({
  'click .subscribeMenuList': function (e) {
    e.preventDefault();
    FlowComponents.callAction('subscribe');
  }
});

var component = FlowComponents.define('menuListHeader', function () {
});

component.state.isArchived = function () {
  var archive = Router.current().params.status;
  return archive && archive == 'archived';
};

component.action.subscribe = function () {
  var subscription = HospoHero.misc.getSubscriptionDocument('menu', 'all');
  Meteor.call('subscribe', subscription, false, HospoHero.handleMethodResult());
};