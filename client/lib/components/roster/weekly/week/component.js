var component = FlowComponents.define("weeklyShiftRoster", function(props) {
  this.name = props.name;
  this.onRendered(this.onListRendered);
});

component.state.week = function() {
  if(this.name == "weeklyroster") {
    var weekNo = Session.get("thisWeek");
    var currentDate = Session.get("checkedDate");
    
    if (!currentDate) {
      currentDate = new Date();
    }
    var week = getDatesFromWeekNumberWithYear(parseInt(weekNo), currentDate);
    return week;
  } else if(this.name == "weeklyrostertemplate") {
    var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek;
  }
}

component.state.origin = function() {
  return this.name;
}

component.prototype.onListRendered = function() {
  var user = Meteor.user();
  if(user.isAdmin || Meteor.isManager) {
    $(".sortable-list > div > li").css("cursor", "move");
    var origin = this.name;
    $(".sortable-list").sortable({
      "connectWith": ".sortable-list",
      "revert": true
    });


    $(".sortable-list").on("sortreceive", function(event, ui) {
      var self = this;
      var id = $(ui.item[0]).attr("data-id");//shiftid
      var  newDate = $(this).attr("data-date")//date of moved list
      if(origin == "weeklyrostertemplate") {
        var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        newDate = parseInt(daysOfWeek.indexOf(newDate));
      }
      if(id && newDate) {
        Meteor.call("editShift", id, {"shiftDate": newDate}, function(err) {
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