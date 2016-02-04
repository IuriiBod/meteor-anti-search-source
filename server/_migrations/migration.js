Migrations.utils = {
  removeCollection: function (collName) {
    Areas.rawDatabase().dropCollection(collName, function () {
    });
  }
};

Meteor.startup(function () {
  logger.warn('Database version: ', Migrations.getVersion());
  Migrations.migrateTo('latest');
});