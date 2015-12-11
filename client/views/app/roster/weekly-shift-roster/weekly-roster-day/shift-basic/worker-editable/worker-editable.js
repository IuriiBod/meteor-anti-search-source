Template.shiftBasicWorkerEditable.onRendered(function () {
  this.$('.select-worker').editable(createSelectWorkerEditableConfig(this));
});

Template.shiftBasicWorkerEditable.helpers({
  assignedTo: function () {
    return this.assignedTo ? this.assignedTo : 'Open';
  }
});


var workersSourceMixin = function (editableConfig, templateInstance) {
  var getAlreadyAssignedWorkersIds = function () {
    var shift = templateInstance.data;
    return Shifts.find({
      _id: {$ne: shift._id},
      startTime: TimeRangeQueryBuilder.forDay(shift.startTime),
      'relations.areaId': HospoHero.getCurrentAreaId(),
      assignedTo: {$ne: null},
      type: shift.type
    }).map(function (shiftEntry) {
      return shiftEntry.assignedTo;
    });
  };

  // Get roles which can be rosted
  var getCanBeRostedRoles = function () {
    return Roles.getRolesByAction('be rosted').map(function (role) {
      return role._id;
    });
  };

  var getTraindeWorkers = function () {
    var shift = templateInstance.data;
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
    var shift = templateInstance.data;
    var workersQuery = {
      "isActive": true,
      $or: [
        {"profile.resignDate": null},
        {"profile.resignDate": {$gt: shift.startTime}}
      ]
    };

    var assignedWorkers = getAlreadyAssignedWorkersIds();
    var trainedWorkers = getTraindeWorkers();
    if (showTrainedWorkers) {
      assignedWorkers = _.difference(trainedWorkers, assignedWorkers);
    } else if (getAvailableWorkers) {
      assignedWorkers = _.union(trainedWorkers, assignedWorkers);
    }

    workersQuery._id = getAvailableWorkers ? {$nin: assignedWorkers} : {$in: assignedWorkers};

    workersQuery["roles." + HospoHero.getCurrentAreaId()] = {$in: getCanBeRostedRoles()};

    return Meteor.users.find(workersQuery, {sort: {"username": 1}}).map(function (worker) {
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