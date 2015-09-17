if(Meteor.isServer) {
  Meteor.startup(function() {
    console.log('Database version: ', Migrations.getVersion());
    if(Migrations.getVersion() == 0) {
      Migrations.migrateTo(1);
    }
  });
}