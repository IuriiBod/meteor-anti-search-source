StaleSessionConfigs = new Meteor.Collection('staleSessionConfigs');

StaleSessionConfigs.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  }
});