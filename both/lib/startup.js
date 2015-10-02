if(Meteor.isServer) {
  Meteor.startup(function() {
    console.log('Database version: ', Migrations.getVersion());
    if(Migrations.getVersion() == 0) {
      Migrations.migrateTo(1);
    } else if(Migrations.getVersion() == 1) {
      Migrations.migrateTo(2);
    }
  });
}