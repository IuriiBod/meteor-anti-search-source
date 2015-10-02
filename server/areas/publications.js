Meteor.publish('getAreasByLocId', function(id) {
  return Areas.find({locationId: id});
});

Meteor.publish('getAreasByOrgId', function(id) {
  return Areas.find({organizationId: id});
});

Meteor.publish('getArea', function(id) {
  return Areas.find({_id: id});
});