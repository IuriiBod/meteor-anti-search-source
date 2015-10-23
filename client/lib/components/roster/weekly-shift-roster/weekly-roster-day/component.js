var daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

var component = FlowComponents.define("weeklyRosterDay", function(props) {
  this.type = props.type;
  this.set('currentDate',props.currentDate);
  this.onRendered(this.onListRendered);
});

component.state.onlyDayNames = function () {
  return this.type === 'template';
};

component.state.shifts = function() {
  var origin = this.origin;
  if(origin == "weeklyroster") {
    var date = HospoHero.dateUtils.shiftDate(this.name.date);
    return Shifts.find({
      "shiftDate": date,
      "type": null,
      "relations.areaId": HospoHero.getCurrentAreaId()
    }, {
      sort: { "order": 1 }
    });
  } else if(origin == "weeklyrostertemplate") {
    return Shifts.find({
      "shiftDate": HospoHero.dateUtils.shiftDate(moment().day(this.name)),
      "type": "template",
      "relations.areaId": HospoHero.getCurrentAreaId()
    });
  }
};

component.action.addShift = function(day, dates) {
  var doc = {
    "assignedTo": null,
    "week": dates
  };
  if(this.origin == "weeklyroster") {
    doc.startTime = new Date(day).setHours(8, 0);
    doc.endTime = new Date(day).setHours(17, 0);
    doc.shiftDate = moment(new Date(day)).format("YYYY-MM-DD");
    doc.section = null;
    doc.type = null;
  } else if(this.origin == "weeklyrostertemplate") {
    doc.startTime = new Date().setHours(8, 0);
    doc.endTime = new Date().setHours(17, 0);
    doc.shiftDate = HospoHero.dateUtils.shiftDate(moment().day(day));
    doc.section = null;
    doc.type = "template";
  }
  Meteor.call("createShift", doc, function(err, id) {
    if(err) {
      HospoHero.error(err);
    }
  });
};

component.state.isTemplate = function() {
  return this.origin == "weeklyrostertemplate";
};

component.prototype.onListRendered = function() {
  var self = this;
  $(".col-lg-13:first").css("margin-left", "0px");
  if(HospoHero.canUser('edit roster', Meteor.userId())) {
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
        if(err && ui.sender) {
          $(ui.sender[0]).sortable('cancel');
          HospoHero.error(err);
        }
      });
    });

    $(".sortable-list").on("sortreceive", function(event, ui) {
      var id = $(ui.item[0]).find("li").attr("data-id");//shiftid
      var newDate = $(this).attr("data-date")//date of moved list
      if(self.origin == "weeklyrostertemplate") {
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
            $(ui.sender[0]).sortable('cancel');
            HospoHero.error(err);
          }
        });
      }
    });
  } else {
    $(".sortable-list > div > li").css("cursor", "default");
  }
};