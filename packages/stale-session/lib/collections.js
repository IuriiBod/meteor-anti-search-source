StaleSessionConfigs = new Meteor.Collection('staleSessionConfigs');

StaleSessionConfigs.allow({
  insert: StaleSession.allowChangeSettings,
  update: StaleSession.allowChangeSettings,
  remove: StaleSession.allowChangeSettings
});