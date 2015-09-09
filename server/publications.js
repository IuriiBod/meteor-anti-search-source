Meteor.publish(null, function(){
  var id = this.userId;
  if(id) {
    var org;
    org = Relations.findOne({
      collectionName: "users",
      entityId: id
    });
    if(org) {
      var cursors = [];
      cursors.push(Relations.find({collectionName: "users", entityId: id}));
      cursors.push(Organizations.find({_id: org.organizationId}));
      cursors.push(Locations.find({organizationId: org.organizationId}));
      cursors.push(Areas.find({organizationId: org.organizationId}));
      return cursors;
    }
  }
});