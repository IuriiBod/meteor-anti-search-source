var migrationFn = function () {
  Locations.find().forEach(function(location) {
    var timezone = location.timezone.replace(/UTC\s\+?/, '');
    Locations.update({_id: location._id}, {$set: {timezone: timezone}});
  });
};


Migrations.add({
  version: 21,
  name: "Remove UTC from location's timezone",
  up: migrationFn
});
