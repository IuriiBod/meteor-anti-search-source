Meteor.publish('userAllUnavailabilities', function () {
  return Meteor.users.find({_id: this.userId},
    {fields: {'unavailabilities': 1}});
});

Meteor.publish('userAllLeaveRequests', function () {
  return LeaveRequests.find({userId: this.userId});
});

Meteor.publish('allLeaveRequests', function () {
  return LeaveRequests.find();
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