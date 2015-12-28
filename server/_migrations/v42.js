Migrations.add({
  version: 42,
  name: "Removing Jobs collection; removing jobs field in Shifts; removing menu items without names",
  up: function () {
    var Jobs = new Mongo.Collection("jobs");
    Jobs.remove({});
    Migrations.utils.removeCollection('jobs');
    Shifts.update({}, {$unset: {jobs: 1}}, {multi: true});
    MenuItems.remove({name: {$exists: false}});
  }
});
