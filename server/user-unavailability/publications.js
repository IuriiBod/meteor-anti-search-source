Meteor.publish('userAllLeaveRequests', function () {
  return LeaveRequests.find({userId: this.userId});
});

Meteor.publish('leaveRequest', function (leaveRequestId) {
  var query = leaveRequestId ? {_id: leaveRequestId} : {};

  var user = Meteor.users.findOne({_id: this.userId});
  var areaIds = user && user.relations && _.isArray(user.relations.areaIds) ? user.relations.areaIds : [];

  query['relations.areaId'] = {$in: areaIds};
  return LeaveRequests.find(query);
});

Meteor.publish('leaveRequestsApprovers', function () {
  var roles = Roles.getRolesByAction('approve leave requests');

  var roleIds = _.map(roles.fetch(), function (role) {
    return role._id;
  });

  var areaId = HospoHero.getCurrentAreaId(this.userId);

  return Meteor.users.find({
    [`roles.${areaId}`]: {$in: roleIds}
  }, {
    fields: HospoHero.security.getPublishFieldsFor('users')
  });
});

Meteor.publishComposite('leaveRequests', function (areaId, limit) {
  check(areaId, HospoHero.checkers.MongoId);
  check(limit, Number);
  const permissionChecker = this.userId && new HospoHero.security.PermissionChecker(this.userId);
  if (permissionChecker && permissionChecker.hasPermissionInArea(areaId, 'approve leave requests')) {
    const query = {
      'relations.areaId': areaId
    };
    return {
      find: function () {
        return LeaveRequests.find(query, {limit: limit});
      },
      children: [
        {
          find: function (leaveRequest) {
            if (leaveRequest && leaveRequest.userId) {
              return Meteor.users.find({_id: leaveRequest.userId}, {
                fields: {
                  'profile.firstname': 1,
                  'profile.lastname': 1
                }
              });
            } else {
              this.ready();
            }
          }
        }
      ]
    };
  } else {
    logger.error('Permission denied: publish [leaveRequests] ', {areaId: areaId, userId: this.userId});
    this.error(new Meteor.Error('Access denied. Not enough permissions.'));
  }
});