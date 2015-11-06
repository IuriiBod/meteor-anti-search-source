Meteor.startup(function () {
  //process.env.NO_MIGRATION - flag that enables run app without migrations
  if (!process.env.NO_MIGRATION) {
    console.log('Database version: ', Migrations.getVersion());
    Migrations.migrateTo('latest');
  }
});