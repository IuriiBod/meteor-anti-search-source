var component = FlowComponents.define("shiftBasic", function(props) {
});

component.prototype.itemRendered = function() {


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

};

// TODO: Check this function
function editShift(obj) {
  Meteor.call("editShift", obj._id, obj, HospoHero.handleMethodResult(function() {
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
      Meteor.call("addShiftUpdate", shiftUpdateDoc, HospoHero.handleMethodResult());
    }
  }));
}

