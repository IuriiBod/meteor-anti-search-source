Meteor.publish('getAllAreas', function(id) {
  return Areas.find({locationId: id});
});