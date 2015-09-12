var component = FlowComponents.define("weeklyRosterDay", function(props) {
  this.name = props.name;
  this.origin = props.origin;
  this.onRendered(this.onListRendered); 
});

component.state.name = function() {
  return this.name;
}

component.state.origin = function() {
  return this.origin;
}

component.state.isUserPermitted = function() {
  var user = Meteor.user();
  if(user.isAdmin || user.isManager) {
    return true;
  } else {
    return false;
  }
}

component.state.shifts = function() {
  var origin = this.origin;
  if(origin == "weeklyroster") {
    var week = Session.get("thisWeek");
    var date = this.name.date;
    return Shifts.find({"shiftDate": new Date(date).getTime(), "type": null}, {sort: {"order": 1}});
  } else if(origin == "weeklyrostertemplate") {
    var daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return Shifts.find({"shiftDate": daysOfWeek.indexOf(this.name), "type": "template"});
  }
}

component.action.addShift = function(day, dates) {
  var doc = {
    "assignedTo": null,
    "week": dates
  }
  if(this.origin == "weeklyroster") {
    doc.startTime = new Date(day).setHours(8, 0);
    doc.endTime = new Date(day).setHours(17, 0);
    doc.shiftDate = moment(new Date(day)).format("YYYY-MM-DD");
    doc.section = null;
    doc.type = null;
  } else if(this.origin == "weeklyrostertemplate") {
    var daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    doc.startTime = new Date().setHours(8, 0);
    doc.endTime = new Date().setHours(17, 0);
    doc.shiftDate = new Date(daysOfWeek.indexOf(day));
    doc.section = null;
    doc.type = "template";
  }
  Meteor.call("createShift", doc, function(err, id) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    }
  });
}

component.state.isTemplate = function() {
  if(this.origin == "weeklyrostertemplate") {
    return true; 
  } else {
    return false;
  }
}

component.prototype.onListRendered = function() {
  var self = this;
  var user = Meteor.user();
  $(".col-lg-13:first").css("margin-left", "0px");
  if(user.isAdmin || Meteor.isManager) {
    $(".sortable-list > div > li").css("cursor", "move");
    var origin = this.name;
    $(".sortable-list").sortable({
      "connectWith": ".sortable-list",
      "revert": true
    });

    $(".sortable-list").on("sortstop", function(event, ui) {
      var id = $(ui.item[0]).find("li").attr("data-id");//shiftid

      var order = 0;
      var nextOrder = $(ui.item[0]).next().find("li").attr("data-order");
      var prevOrder = $(ui.item[0]).prev().find("li").attr("data-order");

      var thisShift = Shifts.findOne(id);

      if(thisShift) {
        if(!nextOrder) {
          order = parseFloat(prevOrder) + 1;
        } else if(!prevOrder) {
          order =  parseFloat(nextOrder) - 1;
        } else {
          order = (parseFloat(nextOrder) + parseFloat(prevOrder))/2;
        }
      }

      Meteor.call("editShift", id, {"order": order}, function(err) {
        if(err) {
          console.log(err);
          $(ui.sender[0]).sortable('cancel');;
          return alert(err.reason);
        }
      });
    });

    $(".sortable-list").on("sortreceive", function(event, ui) {
      var id = $(ui.item[0]).find("li").attr("data-id");//shiftid
      var newDate = $(this).attr("data-date")//date of moved list
      if(self.origin == "weeklyrostertemplate") {
        var daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        newDate = parseInt(daysOfWeek.indexOf(newDate));
      }

      var order = 0;
      var nextOrder = $(ui.item[0]).next().find("li").attr("data-order");
      var prevOrder = $(ui.item[0]).prev().find("li").attr("data-order");

      var thisShift = Shifts.findOne(id);

      if(thisShift) {
        if(!nextOrder) {
          order = parseFloat(prevOrder) + 1;
        } else if(!prevOrder) {
          order =  parseFloat(nextOrder) - 1;
        } else {
          order = (parseFloat(nextOrder) + parseFloat(prevOrder))/2;
        }
      }

      if(id && newDate) {
        Meteor.call("editShift", id, {"shiftDate": newDate, "order": order}, function(err) {
          if(err) {
            console.log(err);
            $(ui.sender[0]).sortable('cancel');;
            return alert(err.reason);
          }
        });
      }
    });
  } else {
    $(".sortable-list > div > li").css("cursor", "default");
  }
}