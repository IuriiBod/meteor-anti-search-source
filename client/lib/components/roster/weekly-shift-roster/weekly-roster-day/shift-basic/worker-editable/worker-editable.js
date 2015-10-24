Template.shiftBasicWorkerEditable.onRendered(function () {
  this.$('.select-worker').editable(createSelectWorkerEditableConfig(this.data));
});

var NotificationSender = {
  aboutRemovalFormShift: function (shift, oldWorkerId) {
    var title = "Update on shift dated " + moment(shift.shiftDate).format("YYYY-MM-DD");
    var text = "You have been removed from this assigned shift";
    this._send(shift._id, oldWorkerId, title, text);
  },
  _send: function (itemId, to, title, text) {
    var options = {
      type: 'roster',
      title: title,
      actionType: 'update',
      text: text,
      to: to
    };
    Meteor.call('sendNotification', itemId, options, HospoHero.handleMethodResult());
  }
};

var workersSourceMixin = function (editableConfig, shift) {
  var getAlreadyAssignedWorkersIds = function () {
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
    var workersQuery = {
      "_id": {$nin: getAlreadyAssignedWorkersIds()},
      "isActive": true,
      $or: [
        {"profile.resignDate": null},
        {"profile.resignDate": {$gt: shift.shiftDate}}
      ]
    };

    workersQuery["roles." + HospoHero.getCurrentAreaId()] = {$in: getCanBeRostedRoles()};

    var workerOptions = Meteor.users.find(workersQuery, {sort: {"username": 1}}).map(function (worker) {
      return {
        value: worker._id,
        text: HospoHero.username(worker)
      };
    });

    workerOptions.push({value: "Open", text: "Open"});

    return workerOptions;
  };

  return _.extend(editableConfig, {source: sourceFn});
};

var createSelectWorkerEditableConfig = function (shift) {
  var assignWorkerToShift = function (workerId) {
    var oldWorkerId = shift.assignedTo;
    shift.assignedTo = workerId;
    Meteor.call('updateShift', shift, HospoHero.handleMethodResult(function () {
      //todo: get rid of this code, it should be done on server side
      if (oldWorkerId && shift.published) {
        //notify old user
        NotificationSender.aboutRemovalFormShift(shift, oldWorkerId);
      }
    }));
  };

  var onEditSuccess = function (response, workerId) {
    workerId = workerId === 'Open' ? null : workerId;
    assignWorkerToShift(workerId);
  };

  var editableOptions = {
    type: "select",
    title: 'Select worker to assign',
    inputclass: "editableWidth",
    showbuttons: false,
    emptytext: 'Open',
    defaultValue: "Open",
    success: onEditSuccess
  };

  //apply data source
  workersSourceMixin(editableOptions, shift);

  return editableOptions;
};