Meteor.publish('jobs', function(type, ids) {
  var query = {
    "relations.areaId": HospoHero.getCurrentAreaId(this.userId)
  };

  if(type == 'unassigned') {
    query.status = "draft";
    query.onshift = null;
  }

  if(ids && ids.length) {
    query._id = { $in: ids };
  }
  return Jobs.find(query, {limit: 10});
});