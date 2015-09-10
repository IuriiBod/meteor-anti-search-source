Meteor.publish(null, function(){
  var id = this.userId;
  if(id) {
    //var org;
    //org = Relations.findOne({
    //  collectionName: "users",
    //  entityId: id
    //});
    //if(org) {
      var cursors = [];
      cursors.push(Relations.find());
      cursors.push(Organizations.find());
      cursors.push(Locations.find());
      cursors.push(Areas.find());
      return cursors;
    //}
  }
});