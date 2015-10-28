var component = FlowComponents.define('jobListHeader', function (props) {

});

component.state.isArchived = function () {
  var archive = Router.current().params.type;
  return archive && archive == 'archive';
};

component.state.isSubscribed = function () {
  return !!Subscriptions.findOne({
    type: 'job',
    subscriber: Meteor.userId(),
    itemIds: 'all'
  });
};

component.action.subscribe = function () {
  var subscription = HospoHero.misc.getSubscriptionDocument('job', 'all');
  Meteor.call('subscribe', subscription, this.get('isSubscribed'), HospoHero.handleMethodResult());
};