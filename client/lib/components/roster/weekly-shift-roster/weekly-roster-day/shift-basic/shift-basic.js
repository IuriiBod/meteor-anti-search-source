$.fn.editable.defaults.mode = 'inline';

Template.shiftBasic.onCreated(function () {

});


Template.shiftBasic.events({
  'click .remove-shift-button': function (event, tmpl) {
    event.preventDefault();
    Meteor.call("deleteShift", tmpl.data._id, HospoHero.handleMethodResult());
  }
});


var workersSourceMixin = function (editableConfig, shift) {
  return _.extend(editableConfig, {
    source: function () {
      //todo: refactor this
      var query = {
        shiftDate: shift.shiftDate,
        'relations.areaId': HospoHero.getCurrentAreaId(),
        assignedTo: {
          $ne: null
        },
        type: shift.type
      };

      var alreadyAssigned = Shifts.find(query).map(function (shiftEntry) {
        if (shift.assignedTo != shiftEntry.assignedTo) {
          return shiftEntry.assignedTo;
        }
      });

      var workersObj = []
      workersObj.push({value: "Open", text: "Open"});

      query = {
        "_id": {$nin: alreadyAssigned},
        "isActive": true,
        $or: [
          {"profile.resignDate": null},
          {"profile.resignDate": {$gt: shift.shiftDate}}
        ]
      };

      // Get roles which can be rosted
      var canBeRostedRolesIds = Roles.getRolesByAction('be rosted').map(function (role) {
        return role._id;
      });

      query["roles." + HospoHero.getCurrentAreaId()] = {$in: canBeRostedRolesIds};

      return Meteor.users.find(query, {sort: {"username": 1}}).map(function (worker) {
        return {
          value: worker._id,
          text: HospoHero.username(worker)
        }
      });
    }
  });
};

//todo refactor this
var sendNotification = function (itemId, to, title, text) {
  var options = {
    type: 'roster',
    title: title,
    actionType: 'update',
    text: text,
    to: to
  };
  Meteor.call('sendNotification', itemId, options, HospoHero.handleMethodResult());
};

//editable configs
var createSelectWorkerEditableConfig = function (shift) {
  var assignWorkerToShift = function (workerId) {
    var oldWorkerId = shift.assignedTo;
    shift.assignedTo = workerId;
    Meteor.call('updateShift', shift, HospoHero.handleMethodResult(function () {
      //todo: get rid of this code, it should be done on server side
      if (oldWorkerId && shift.published) {
        //notify old user
        var title = "Update on shift dated " + moment(shift.shiftDate).format("YYYY-MM-DD");
        var text = "You have been removed from this assigned shift";
        sendNotification(shift._id, oldWorkerId, title, text);
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


Template.shiftBasic.onRendered(function () {
  $('.select-worker').editable(createSelectWorkerEditableConfig(this.data));
});