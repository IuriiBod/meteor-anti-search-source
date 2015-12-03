Migrations.utils = {
  removeDatabase: function (dbName) {
    Areas.rawDatabase().dropCollection(dbName, function () {
    });
  }
};

if (!HospoHero.isDatabaseImportMode()) {
  Meteor.startup(function () {
    console.log('Database version: ', Migrations.getVersion());
    Migrations.migrateTo('latest');
  });
}
