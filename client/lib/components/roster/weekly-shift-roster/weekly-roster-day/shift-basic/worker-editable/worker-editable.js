Template.shiftBasicWorkerEditable.onRendered(function () {
  this.$('.select-worker').editable(createSelectWorkerEditableConfig(this));
});


var workersSourceMixin = function (editableConfig, templateInstance) {
  var getAlreadyAssignedWorkersIds = function () {
    var shift = templateInstance.data;
    return Shifts.find({
      _id: {$ne: shift._id},
      shiftDate: TimeRangeQueryBuilder.forDay(shift.shiftDate),
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

  var sourceFn = function () {
    var shift = templateInstance.data;
    var workersQuery = {
      "_id": {$nin: getAlreadyAssignedWorkersIds()},
      "isActive": true,
      $or: [
        {"profile.resignDate": null},
        {"profile.resignDate": {$gt: shift.shiftDate}}
      ]
    };

    workersQuery["roles." + HospoHero.getCurrentAreaId()] = {$in: getCanBeRostedRoles()};

    return Meteor.users.find(workersQuery, {sort: {"username": 1}}).map(function (worker) {
      return {
        value: worker._id,
        text: HospoHero.username(worker)
      };
    });
  };

  return _.extend(editableConfig, {source: sourceFn});
};


var createSelectWorkerEditableConfig = function (templateInstance) {
  var assignWorkerToShift = function (workerId) {
    var shift = templateInstance.data;
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