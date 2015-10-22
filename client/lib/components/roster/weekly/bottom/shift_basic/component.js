var component = FlowComponents.define("shiftBasic", function(props) {
  this.shift = props.shift;
  origin = props.origin;
  this.set("origin", origin);
  this.onRendered(this.itemRendered);
});

component.state.shift = function() {
  return this.shift;
};

component.state.thisorigin = function() {
  return this.get("origin");
};

component.state.section = function() {
  return this.shift.section;
};

component.state.assignedTo = function() {
  return this.shift.assignedTo;
};

component.action.deleteShift = function(id) {
  Meteor.call("deleteShift", id, function(err) {
    if(err) {
      HospoHero.error(err);
    }
  });
};

component.prototype.itemRendered = function() {
  $.fn.editable.defaults.mode = 'inline';
  var origin = this.get("origin");
  setTimeout(function() {
    $('.select-worker').editable({
      type: "select",
      title: 'Select worker to assign',
      inputclass: "editableWidth",
      showbuttons: false,
      emptytext: 'Open',
      defaultValue: "Open",
      source: function() {
        var shiftId = $(this).closest("li").attr("data-id");
        var thisShift = Shifts.findOne(shiftId);

        var query = {
          shiftDate: thisShift.shiftDate,
          'relations.areaId': HospoHero.getCurrentAreaId(),
          assignedTo: {
            $ne: null
          }
        };
        query.type = origin == "weeklyroster" ? null : 'template';
        var alreadyAssigned = Shifts.find(query).map(function(shift) {
          if(thisShift.assignedTo != shift.assignedTo) {
            return shift.assignedTo;
          }
        });

        workersObj.push({value: "Open", text: "Open"});

        query = {
          "_id": {$nin: alreadyAssigned},
          "isActive": true,
          $or: [
            {"profile.resignDate": null},
            {"profile.resignDate": {$gt: thisShift.shiftDate}}
          ]
        };

        // Get roles which can be rosted
        var canBeRostedRolesIds = Roles.getRolesByAction('be rosted').map(function(role) {
          return role._id;
        });

        query["roles." + HospoHero.getCurrentAreaId()] = {$in: canBeRostedRolesIds};
        return Meteor.users.find(query, {sort: {"username": 1}}).map(function(worker) {
          return {
            value: worker._id,
            text: HospoHero.username(worker)
          }
        });
      },
      success: function(response, newValue) {
        var shiftId = $(this).closest("li").attr("data-id");
        if(newValue == "Open") {
          newValue = null;
        }

        var shift = Shifts.findOne(shiftId);
        if(shift) {
          assignWorkerToShift(newValue, shiftId, $(this));
        }
        if(origin == "weeklyroster") {
          if(shift.assignedTo && shift.published) {
            //notify old user
            var title =  "Update on shift dated " + moment(shift.shiftDate).format("YYYY-MM-DD");
            var text = "You have been removed from this assigned shift";
            sendNotification(shiftId, shift.assignedTo, title, text);

            var shiftUpdateDoc = {
              to: shift.assignedTo,
              userId: Meteor.userId(),
              shiftId: shift._id,
              text: "You have been removed from shift dated <b>" + HospoHero.dateUtils.intervalDateFormat(shift.startTime, shift.endTime) + "</b>",
              type: "remove"
            };

            Meteor.call("addShiftUpdate", shiftUpdateDoc, function(err) {
              if(err) {
                HospoHero.error(err);
              }
            });
          }
        }
      }
    });   

    $('.section').editable({
      type: "select",
      title: "Select section to assign",
      inputclass: "editableWidth",
      showbuttons: false,
      emptytext: 'Open',
      defaultValue: "Open",    
      source: function() {
        var sections = Sections.find({
          "relations.areaId": HospoHero.getCurrentAreaId()
        }).fetch();
        var sectionsObj = [];
        sectionsObj.push({value: "Open", text: "Open"});
        sections.forEach(function(section) {
          sectionsObj.push({"value": section._id, "text": section.name});
        });
        return sectionsObj;
      },
      success: function(response, newValue) {
        if(newValue == "Open") {
          newValue = null;
        }
        var shiftId = $(this).closest("li").attr("data-id");
        var obj = {"_id": shiftId, "section": newValue};
        var shift = Shifts.findOne(shiftId);
        if(shift) {
          editShift(obj);
        }
      }
    });

    $(".shiftStartTime").editable({
      type: 'combodate',
      title: 'Select start time',
      template: "HH:mm",
      viewformat: "HH:mm",
      format: "YYYY-MM-DD HH:mm",
      display: false,
      showbuttons: true,
      inputclass: "editableTime",
      mode: 'inline',
      success: function(response, newValue) {
        var shiftId = $(this).closest("li").attr("data-id");
        var obj = {"_id": shiftId};
        var shift = Shifts.findOne(shiftId);
        if(shift) {
          if(origin == "weeklyrostertemplate") {
            obj.startTime = newValue;
          } else if(origin == "weeklyroster") {
            var startHour = moment(newValue).hour();
            var startMin = moment(newValue).minute();
            obj.startTime = moment(shift.shiftDate).set('hour', startHour).set("minute", startMin).toDate();
          }
          editShift(obj);
        }
      }
    });

    $(".shiftEndTime").editable({
      type: 'combodate',
      title: 'Select end time',
      template: "HH:mm",
      viewformat: "HH:mm",
      format: "YYYY-MM-DD HH:mm",
      url: '/post',
      display: false,
      showbuttons: true,
      inputclass: "editableTime",
      mode: 'inline',
      success: function(response, newValue) {
        var shiftId = $(this).closest("li").attr("data-id");
        var obj = {"_id": shiftId};
        var shift = Shifts.findOne(shiftId);
        if(shift) {
          if(origin == "weeklyrostertemplate") {
            obj.endTime = newValue;
          } else if(origin == "weeklyroster") {
            var endHour = moment(newValue).hour();
            var endMin = moment(newValue).minute();
            obj.endTime = moment(shift.shiftDate).set('hour', endHour).set("minute", endMin).toDate();
          }
          editShift(obj);
        }
      }
    });  
  }, 500);
};

function editShift(obj) {
  Meteor.call("editShift", obj._id, obj, function(err) {
    if(err) {
      HospoHero.error(err);
    } else {
      var shift = Shifts.findOne(obj._id);
      if(shift.published && shift.assignedTo) {
        //notify new user
        var title = "Update on shift dated " + moment(shift.shiftDate).format("YYYY-MM-DD");
        var text = null;
        var shiftUpdateDoc = {
          to: shift.assignedTo,
          userId: Meteor.userId(),
          shiftId: shift._id,
          type: "update",
          text: 'Shift dated <b>' + HospoHero.dateUtils.intervalDateFormat(shift.startTime, shift.endTime) + '</b>'
        };
        if(obj.hasOwnProperty("endTime")) {
          text = 'Shift end time has been updated';
          shiftUpdateDoc.text += ' end time has been updated';
        }
        if(obj.hasOwnProperty("startTime")) {
          text = 'Shift start time has been updated';
          shiftUpdateDoc.text += ' start time has been updated';
        }
        if(obj.hasOwnProperty("section")) {
          text = 'Shift section has been updated';
          shiftUpdateDoc.text += ' section has been updated';
        }
        sendNotification(obj._id, shift.assignedTo, title, text);
        Meteor.call("addShiftUpdate", shiftUpdateDoc, function(err) {
          if(err) {
            HospoHero.error(err);
          }
        });
      }
    }
  });
}

assignWorkerToShift = function(worker, shiftId, target) {
  var shift = Shifts.findOne(shiftId);
  if(shift) {
    Meteor.call("assignWorker", worker, shiftId, function(err) {
      if(err) {
        $(target).editable("setValue", shift.assignedTo);
        HospoHero.error(err);
      } else {
        if(shift.published && worker !== null) {
          //notify new user
          var title = "Update on shift dated " + moment(shift.shiftDate).format("YYYY-MM-DD");
          var text = "You have been assigned to this shift";
          sendNotification(shiftId, worker, title, text);
          var shiftUpdateDoc = {
            to: worker,
            userId: Meteor.userId(),
            shiftId: shift._id,
            text: "You have been assigned to shift dated <b>" + HospoHero.dateUtils.intervalDateFormat(shift.startTime, shift.endTime) + "</b>",
            type: "update"
          };

          Meteor.call("addShiftUpdate", shiftUpdateDoc, function(err) {
            if(err) {
              HospoHero.error(err);
            }
          });
        }
      }
    });
  }
};


function sendNotification(itemId, to, title, text) {
  var type = "roster";
  var options = {
    "title": title,
    "type": "update",
    "text": text,
    "to": to
  };
  Meteor.call("sendNotifications", itemId, type, options, function(err) {
    if(err) {
      HospoHero.error(err);
    }
  });
}