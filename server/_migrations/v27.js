Migrations.add({
  version: 27,
  name: "Remove shift update hours",
  up: function () {
    Locations.update({}, {$unset: {shiftUpdateHour: 1}});
  }
});