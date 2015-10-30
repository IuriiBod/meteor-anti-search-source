Migrations.add({
  version: 6,
  name: "Adding default shift updates cron time to the locations",
  up: function () {
    var locations = Locations.find({
      shiftUpdateHour: null
    }).fetch();

    if (locations.length) {
      locations.forEach(function (location) {
        Locations.update({
          _id: location._id
        }, {
          $set: {
            shiftUpdateHour: 7
          }
        });
      });
    }
  }
});