Meteor.publish('getAllAreas', function(id) {
  return Areas.find({locationId: id});
});

Meteor.publish('getArea', function(id) {
  return Areas.find({_id: id});
});