Migrations.add({
  version: 32,
  name: "Remove shift update hour property in locations",
  up: function () {
    Locations.update({}, {$unset: {shiftUpdateHour: ''}}, {multi: true});
  }
});
