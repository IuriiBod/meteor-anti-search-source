var component = FlowComponents.define('menuListHeader', function () {});

component.state.isArchived = function () {
  var archive = Router.current().params.status;
  return archive && archive == 'archived';
};

component.state.isSubscribed = function () {
  return !!Subscriptions.findOne({
    type: 'menu',
    subscriber: Meteor.userId(),
    itemIds: 'all'
  });
};

component.action.subscribe = function () {
  var subscription = HospoHero.misc.getSubscriptionDocument('menu', 'all');
  Meteor.call('subscribe', subscription, this.get('isSubscribed'), HospoHero.handleMethodResult());
};