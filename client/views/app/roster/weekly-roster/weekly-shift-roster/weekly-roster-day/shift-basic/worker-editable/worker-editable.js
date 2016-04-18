class WorkerEditableDataSource {
  constructor(shift) {
    this._shift = shift;
  }

  _getAlreadyAssignedWorkersIds() {
    let shift = this._shift;
    let occupiedTimeRange = TimeRangeQueryBuilder.forInterval(shift.startTime, shift.endTime);

    let assignedUserIds = Shifts.find({
      _id: {$ne: shift._id},
      startTime: occupiedTimeRange,
      assignedTo: {$ne: null},
      type: shift.type,
      'relations.areaId': HospoHero.getCurrentAreaId()
    }).map(shiftEntry => shiftEntry.assignedTo);

    // this is a very strange functionality for checking
    // if the shift is placed in unavailable for user time
    // need to refactor
    let unavailableUserIds = Meteor.users.find().map(user =>
      HospoHero.misc.hasUnavailability(user.unavailabilities, shift) ? user._id : false
    );
    unavailableUserIds = _.compact(unavailableUserIds);

    let leaveRequestsUserIds = LeaveRequests.find({
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
    }).map(leaveRequest => leaveRequest.userId);

    return _.union(assignedUserIds, unavailableUserIds, leaveRequestsUserIds);
  }

  _getCanBeRostedRoles() {
    return Roles.getRolesByAction('be rosted', this._shift.relations.areaId).map(role => role._id);
  }

  _getTrainedWorkers() {
    let shiftSection = this._shift.section;

    if (shiftSection) {
      return Meteor.users.find({'profile.sections': shiftSection}).map(user => user._id);
    } else {
      return [];
    }
  }

  _getWorkersByCriteria(getAvailableWorkers, showTrainedWorkers) {
    let shift = this._shift;

    let assignedWorkers = this._getAlreadyAssignedWorkersIds();
    let trainedWorkers = this._getTrainedWorkers();
    if (showTrainedWorkers) {
      assignedWorkers = _.difference(trainedWorkers, assignedWorkers);
    } else if (getAvailableWorkers) {
      assignedWorkers = _.union(trainedWorkers, assignedWorkers);
    }

    let workersQuery = {
      _id: getAvailableWorkers ? {$nin: assignedWorkers} : {$in: assignedWorkers},
      [`roles.${shift.relations.areaId}`]: {$in: this._getCanBeRostedRoles()},
      $or: [
        {"profile.resignDate": null},
        {"profile.resignDate": {$gt: shift.startTime}}
      ]
    };

    let workersCursor = Meteor.users.find(workersQuery, {sort: {'profile.firstname': 1}});
    return workersCursor.map(function (worker) {
      return {
        value: worker._id,
        text: HospoHero.username(worker)
      };
    });
  }

  getWorkersOptions() {
    return [
      {text: '-- Available & Trained --', options: this._getWorkersByCriteria(false, true)},
      {text: '-- Available --', options: this._getWorkersByCriteria(true, false)},
      {text: '-- Not available --', options: this._getWorkersByCriteria(false, false)}
    ];
  }
}


Template.shiftBasicWorkerEditable.helpers({
  workerSelectConfig() {
    let tmpl = Template.instance();
    let workersDataSource = new WorkerEditableDataSource(tmpl.data);
    
    return {
      values: workersDataSource.getWorkersOptions(),
      emptyValue: 'Open',
      selected: this.assignedTo,
      onValueChanged: function (workerId) {
        let shift = Shifts.findOne({_id: tmpl.data._id});
        shift.assignedTo = workerId;
        Meteor.call('editShift', shift, Template.shiftBasic.errorHandlerForShiftEdit(shift));
      }
    };
  }
});