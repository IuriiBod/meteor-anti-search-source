Migrations.add({
  version: 24,
  name: "change time zone format",
  up: function () {
    Locations.update({}, {$set: {timezone: 'Australia/Melbourne'}}, {multi: true});
  }
});