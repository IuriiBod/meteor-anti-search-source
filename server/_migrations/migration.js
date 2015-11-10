if (!HospoHero.isDatabaseImportMode()) {
  Meteor.startup(function () {
    //process.env.NO_MIGRATION - flag that enables run app without migrations
    console.log('Database version: ', Migrations.getVersion());
    Migrations.migrateTo('latest');
  });
}
