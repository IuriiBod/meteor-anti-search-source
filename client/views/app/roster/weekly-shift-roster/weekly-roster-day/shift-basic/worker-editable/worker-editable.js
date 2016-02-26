Template.shiftBasicWorkerEditable.onRendered(function () {
  this.$('.select-worker').editable(createSelectWorkerEditableConfig(this));
});

Template.shiftBasicWorkerEditable.helpers({
  assignedTo: function () {
    return this.assignedTo ? this.assignedTo : 'Open';
  }
});


var workersSourceMixin = function (editableConfig, templateInstance) {
  var getAlreadyAssignedWorkersIds = function (shift) {
    var occupiedTimeRange = TimeRangeQueryBuilder.forInterval(shift.startTime, shift.endTime);

    var assignedUserIds = Shifts.find({
      _id: {$ne: shift._id},
      startTime: occupiedTimeRange,
      'relations.areaId': HospoHero.getCurrentAreaId(),
      assignedTo: {$ne: null},
      type: shift.type
    }).map(function (shiftEntry) {
      return shiftEntry.assignedTo;
    });

    // this is a very strange functionality for checking
    // if the shift is placed in unavailable for user time
    // need to refactor
    var unavailableUserIds = Meteor.users.find().map(function (user) {
      return HospoHero.misc.hasUnavailability(user.unavailabilities, shift) ? user._id : false;
    });
    unavailableUserIds = _.compact(unavailableUserIds);

    var leaveRequestsUserIds = LeaveRequests.find({
      status: "approved",
      $or: [
        {
          startDate: occupiedTimeRange
        }, {
          endDate: occupiedTimeRange
        }, {
          startDate: {$lte: shift.startTime},
          endDate: {$gte: shift.endTime}
        }
      ]
    }).map(function (leaveRequest) {
      return leaveRequest.userId;
    });

    return _.union(assignedUserIds, unavailableUserIds, leaveRequestsUserIds);
  };

  // Get roles which can be rosted
  var getCanBeRostedRoles = function (areaId) {
    return Roles.getRolesByAction('be rosted', areaId).map(function (role) {
      return role._id;
    });
  };

  var getTrainedWorkers = function (shift) {
    var shiftSection = shift.section;

    if (shiftSection) {
      return Meteor.users.find({'profile.sections': shiftSection}).map(function (user) {
        return user._id;
      });
    } else {
      return [];
    }
  };

  var sourceFn = function (getAvailableWorkers, showTrainedWorkers) {
    var shift = Shifts.findOne({_id: templateInstance.data._id});
    var workersQuery = {
      $or: [
        {"profile.resignDate": null},
        {"profile.resignDate": {$gt: shift.startTime}}
      ]
    };

    var assignedWorkers = getAlreadyAssignedWorkersIds(shift);
    var trainedWorkers = getTrainedWorkers(shift);
    if (showTrainedWorkers) {
      assignedWorkers = _.difference(trainedWorkers, assignedWorkers);
    } else if (getAvailableWorkers) {
      assignedWorkers = _.union(trainedWorkers, assignedWorkers);
    }

    workersQuery._id = getAvailableWorkers ? {$nin: assignedWorkers} : {$in: assignedWorkers};

    workersQuery["roles." + shift.relations.areaId] = {$in: getCanBeRostedRoles(shift.relations.areaId)};

    return Meteor.users.find(workersQuery, {sort: {"profile.firstname": 1}}).map(function (worker) {
      return {
        value: worker._id,
        text: HospoHero.username(worker)
      };
    });
  };

  editableConfig.source = function () {
    return [
      {text: '-- Available & Trained --', children: sourceFn(false, true)},
      {text: '-- Available --', children: sourceFn(true, false)},
      {text: '-- Not available --', children: sourceFn(false, false)}
    ];
  };
  return editableConfig;
};


var createSelectWorkerEditableConfig = function (templateInstance) {
  var assignWorkerToShift = function (workerId) {
    var shift = Shifts.findOne({_id: templateInstance.data._id});
    shift.assignedTo = workerId;
    Meteor.call('editShift', shift, HospoHero.handleMethodResult());
  };

  var onEditSuccess = function (response, workerId) {
    workerId = workerId === 'Open' ? null : workerId;
    assignWorkerToShift(workerId);
  };

  var editableOptions = {
    type: "select",
    title: 'Select worker to assign',
    prepend: [{value: "Open", text: "Open"}],
    inputclass: "editableWidth",
    showbuttons: false,
    emptytext: 'Open',
    defaultValue: "Open",
    //block internal x-editable displaying because we are using blaze for it
    display: function () {
      return '';
    },
    success: onEditSuccess
  };

  //apply data source
  workersSourceMixin(editableOptions, templateInstance);

  return editableOptions;
};