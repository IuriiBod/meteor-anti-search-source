let approvePermission = (areaId,userId,permission) => {
    let permissionChecker = new HospoHero.security.PermissionChecker(userId);
    return areaId && userId && permissionChecker.hasPermissionInArea(areaId,permission);
};

Meteor.publish('usersLeaveRequests', function (areaId) {
  check(areaId, HospoHero.checkers.MongoId);

  if(!approvePermission(areaId,userId,'view requests')){
    logger.error('Permission denied: publish [usersLeaveRequests] ', {areaId: areaId, userId: this.userId});
    this.error(new Meteor.Error('Access denied. Not enough permissions.'));
  }
  return LeaveRequests.find({userId: this.userId});
});

Meteor.publish('usersUnavailabilities', function (areaId) {
  check(areaId, HospoHero.checkers.MongoId);

  if(!approvePermission(areaId,userId,'view unavailability')){
    logger.error('Permission denied: publish [usersUnavailabilities] ', {areaId: areaId, userId: this.userId});
    this.error(new Meteor.Error('Access denied. Not enough permissions.'));
  }

  return Unavailabilities.find({userId: this.userId});
});

Meteor.publishComposite('unavailabilitiesInArea', function (areaId, limit, managerStatus) {
  check(areaId, HospoHero.checkers.MongoId);
  check(limit, Number);
  check(managerStatus, Match.OneOf('all', HospoHero.checkers.LeaveRequestStatusValue));

  if(!approvePermission(areaId,this.userId,'approve unavailability')){
    logger.error('Permission denied: publish [unavailabilitiesInArea] ', {areaId: areaId, userId: this.userId});
    this.error(new Meteor.Error('Access denied. Not enough permissions.'));
  }

  return {
    find: function () {
      const query = {'relations.areaId': areaId};
      if (managerStatus !== 'all') {
        _.extend(query, {'status.value': managerStatus});
      }
      return Unavailabilities.find(query, {sort: {startDate: 1}, limit: limit});
    },
    children: [{
      find: function (unavailability) {
        var query = {};
        if (unavailability.managerStatus) {
          query = {_id: {$in: [unavailability.userId, unavailability.managerStatus.setAt]}};
        } else {
          query = {_id: unavailability.userId};
        }
        return Meteor.users.find(query, HospoHero.security.getPublishFieldsFor('users'));
      }
    }]
  };
});

Meteor.publishComposite('leaveRequestsInArea', function (areaId, limit, managerStatus) {
  check(areaId, HospoHero.checkers.MongoId);
  check(limit, Number);
  check(managerStatus, Match.OneOf('all', HospoHero.checkers.LeaveRequestStatusValue));

  if(!approvePermission(areaId,this.userId,'approve requests')){
    logger.error('Permission denied: publish [leaveRequestsInArea] ', {areaId: areaId, userId: this.userId});
    this.error(new Meteor.Error('Access denied. Not enough permissions.'));
  }

  const query = {'relations.areaId': areaId};
  if (managerStatus !== 'all') {
    _.extend(query, {'status.value': managerStatus});
  }
  return {
    find: function () {
      return LeaveRequests.find(query, {sort: {startDate: 1}, limit: limit});
    },
    children: [
      {
        find: function (leaveRequest) {
          var query = {};
          if (leaveRequest.managerStatus) {
            query = {_id: {$in: [leaveRequest.userId, leaveRequest.managerStatus.setAt]}};
          } else {
            query = {_id: leaveRequest.userId};
          }
          return Meteor.users.find(query, HospoHero.security.getPublishFieldsFor('users'));
        }
      }
    ]
  };
});


Meteor.publish('leaveRequest', function (areaId,leaveRequestId) {
  check(areaId, HospoHero.checkers.MongoId);
  check(leaveRequestId, HospoHero.checkers.MongoId);

  if(!approvePermission(areaId,this.userId,'approve requests')){
    logger.error('Permission denied: publish [leaveRequest] ', {areaId: areaId, userId: this.userId});
    this.error(new Meteor.Error('Access denied. Not enough permissions.'));
  }

  return LeaveRequests.find({_id:leaveRequestId});
});

Meteor.publish('leaveRequestsApprovers', function (areaId) {
  check(areaId, HospoHero.checkers.MongoId);

  if(!approvePermission(areaId,this.userId,'approve requests')){
    logger.error('Permission denied: publish [leaveRequestsApprovers] ', {areaId: areaId, userId: this.userId});
    this.error(new Meteor.Error('Access denied. Not enough permissions.'));
  }

  var roles = Roles.getRolesByAction('approve leave requests');

  var roleIds = _.map(roles.fetch(), function (role) {
    return role._id;
  });

  return Meteor.users.find({
    [`roles.${areaId}`]: {$in: roleIds}
  }, {
    fields: HospoHero.security.getPublishFieldsFor('users')
  });
});