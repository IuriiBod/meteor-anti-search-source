// FC can't be removed now
var component = FlowComponents.define('jobListHeader', function (props) {

});

component.state.isArchived = function () {
  var archive = Router.current().params.type;
  return archive && archive == 'archive';
};

component.action.subscribe = function () {
  var subscription = HospoHero.misc.getSubscriptionDocument('job', 'all');
  Meteor.call('subscribe', subscription, false, HospoHero.handleMethodResult());
};