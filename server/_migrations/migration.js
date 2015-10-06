Meteor.startup(function() {
  console.log('Database version: ', Migrations.getVersion());
  Migrations.migrateTo('latest');
});