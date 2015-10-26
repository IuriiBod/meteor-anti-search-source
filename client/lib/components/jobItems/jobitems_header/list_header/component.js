var component = FlowComponents.define('jobListHeader', function (props) {

});

component.state.isArchived = function () {
  var archive = Router.current().params.type;
  return archive && archive == 'archive';
};

component.state.isSubscribed = function () {
  return !!Subscriptions.findOne({_id: 'joblist', subscribers: Meteor.userId()});
};