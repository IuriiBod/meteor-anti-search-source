Meteor.publish('userAllUnavailabilities', function () {
  return Meteor.users.find({_id: this.userId},
    {fields: {'unavailabilities': 1}});
});

Meteor.publish('userAllLeaveRequests', function () {
  return LeaveRequests.find({userId: this.userId});
});

Meteor.publish('leaveRequest', function (leaveRequestId) {
  var query = leaveRequestId ? {_id: leaveRequestId} : {};
  var areaIds = Meteor.users.findOne({_id: this.userId}).relations.areaIds || [];
  query['relations.areaId'] = {$in: areaIds};
  return LeaveRequests.find(query);
});

Meteor.publish('leaveRequestsApprovers', function () {
  var roles = Roles.getRolesByAction('approve leave requests');
  var roleIds = _.map(roles.fetch(), function (role) {
    return role._id;
  });

  var areaId = HospoHero.getCurrentAreaId(this.userId);
  var query = {};
  query['roles.' + areaId] = {$in: roleIds};
  return Meteor.users.find(query, {
    fields: {
      username: 1,
      profile: 1,
      roles: 1,
      relations: 1
    }
  });
});