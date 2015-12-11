Migrations.utils = {
  removeCollection: function (collName) {
    Areas.rawDatabase().dropCollection(collName, function () {
    });
  }
};

if (!HospoHero.isDatabaseImportMode()) {
  Meteor.startup(function () {
    console.log('Database version: ', Migrations.getVersion());
    Migrations.migrateTo('latest');
  });
}
