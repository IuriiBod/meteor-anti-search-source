Meteor.publish(null, function () {
  return StaleSessionConfigs.find();
});