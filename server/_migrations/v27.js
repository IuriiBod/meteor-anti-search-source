var removeDatabase = function (dbName) {
  Areas.rawDatabase().dropCollection(dbName, function () {
  });
};

Migrations.add({
  version: 27,
  name: "Remove shift update hours",
  up: function () {
    Locations.update({}, {$unset: {shiftUpdateHour: 1}});

    var ShiftsUpdates = new Mongo.Collection('shiftsUpdates');
    ShiftsUpdates.remove({});
    removeDatabase('shiftsUpdates');
  }
});