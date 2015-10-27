//apply service configurations
var services = Meteor.settings.services;

if (_.isArray(services)) {
  services.forEach(function (serviceEntry) {
    ServiceConfiguration.configurations.upsert({service: serviceEntry.service}, {$set: serviceEntry});
  });
}
