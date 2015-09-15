Meteor.publish(null, function(){
  var id = this.userId;
  if(id) {
    //var org;
    //org = Relations.findOne({
    //  collectionName: "users",
    //  entityId: id
    //});
    //if(org) {
      return [
        Relations.find(),
        Organizations.find(),
        Locations.find(),
        Areas.find(),
        Invitations.find()
      ];
    //}
  }
});