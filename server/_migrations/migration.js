Meteor.startup(function() {
  console.log('Database version: ', Migrations.getVersion());
  if(Migrations.getVersion() == 0) {
    Migrations.migrateTo(1);
  }

  if(Migrations.getVersion() == 1) {
    Migrations.migrateTo(2);
  }

  if(Migrations.getVersion() == 2) {
    Migrations.migrateTo(3);
  }
});