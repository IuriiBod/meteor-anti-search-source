var component = FlowComponents.define('editJobItem', function (props) {
  var id = Router.current().params._id;
  if (id) {
    var item = JobItems.findOne(id);
    if(item) {
      Session.set("jobType", item.type);
      this.item = item;
    }
  }
  var typeId = this.item.type;
  var type = JobTypes.findOne({_id: typeId});
  this.set('type', type.name);
  this.onRendered(this.onFormRendered);
});

component.state.initialHTML = function () {
  var id = Session.get("thisJobItem");
  var item = JobItems.findOne(id);
  var type = item.type;
  var jobtype = JobTypes.findOne(type);
  if(jobtype && jobtype.name === "Prep") {
    if(item.recipe) {
      return item.recipe;
    } else {
      return "Add recipe here";
    }
  } else if(jobtype && jobtype.name === "Recurring") {
    if(item.description) {
      return item.description;
    } else {
      return "Add description here";
    }
  }
};

component.state.isPrep = function() {
  var type = this.item.type;
  if(Session.get("jobType")) {
    type = Session.get("jobType");
  }
  var jobtype = JobTypes.findOne(type);
  if(jobtype) {
    return jobtype.name === "Prep";
  }
};

component.state.isRecurring = function() {
  var type = this.item.type;
  if(Session.get("jobType")) {
    type = Session.get("jobType");
  }
  var jobtype = JobTypes.findOne(type);
  if(jobtype) {
    return jobtype.name == "Recurring";
  }
};

component.state.item = function () {
  return this.item;
};

component.state.step = function () {
  return this.item.step || 2;
};

component.state.jobTypes = function () {
  return JobTypes.find({"_id": {$nin: [this.item.type]}});
};

component.state.frequencyWithSelected = function() {
  var frequencies = [{
    index: "Daily",
    selected: false
  }, {
    index: "Weekly",
    selected: false
  }, {
    index: "Every X Weeks",
    selected: false
  }];
  var frequency = this.item.frequency;
  if (Session.get("frequency")) {
    frequency = Session.get("frequency");
  }
  this.set("frequency", frequency);
  frequencies.forEach(function (doc) {
    if (frequency == doc.index) {
      doc.selected = true;
    }
  });
  return frequencies;
};


component.state.isRecurringDaily = function () {
  return this.get("frequency") === "Daily";
};


component.state.isRecurringEveryXWeeks = function () {
  return this.get("frequency") === "Every X Weeks";
};

component.state.checklist = function () {
  var list = this.item.checklist;
  if (list) {
    if (list.length > 0) {
      Session.set("checklist", list);
      return this.item.checklist;
    }
  }
};

component.state.repeatAt = function () {
  var at = this.item.repeatAt;
  if(!this.item.repeatAt) {
    return "8:00 AM";
  } else {
    return moment(at).format("h:mm A");
  }
};
component.state.startsOn = function () {
  if (this.item.startsOn) {
    return moment(this.item.startsOn).format("YYYY-MM-DD");
  } else {
    return moment().format("YYYY-MM-DD");
  }
};

component.state.endsOnNotNull = function () {
  return !!this.item.endsOn;
};

component.state.endsNever = function () {
  var item = this.item;
  if (item && item.endsOn) {
    return item.endsOn.on == "endsNever";
  }
};

component.state.endsAfter = function () {
  var item = this.item;
  if (item && item.endsOn) {
    return item.endsOn.on == "endsAfter";
  }
};

component.state.endOccurrences = function () {
  var item = this.item;
  if (item && item.endsOn) {
    return item.endsOn.on == "endsAfter" ? item.endsOn.after : 10;
  }
};

component.state.endsOn = function () {
  var item = this.item;
  if (item && item.endsOn) {
    return item.endsOn.on == "endsOn";
  }
};

component.state.endDate = function () {
  var item = this.item;
  if (item && item.endsOn) {
    if (item.endsOn.on == "endsOn") {
      return moment(item.endsOn.lastDate).format("YYYY-MM-DD");
    } else {
      return moment().add(7, 'days').format("YYYY-MM-DD");
    }
  }
};

component.state.weekWithRepeats = function () {
  var week = [
    {"index": "Mon", "checked": false},
    {"index": "Tue", "checked": false},
    {"index": "Wed", "checked": false},
    {"index": "Thurs", "checked": false},
    {"index": "Fri", "checked": false},
    {"index": "Sat", "checked": false},
    {"index": "Sun", "checked": false}
  ];
  if (this.item && this.item.repeatOn) {
    var repeatOn = this.item.repeatOn;
    if (repeatOn.length > 0) {
      week.forEach(function (doc) {
        if (repeatOn.indexOf(doc.index) >= 0) {
          doc.checked = true;
        }
      });
    }
  }
  return week;
};

component.state.repeatOnDays = function () {
  var item = this.item;
  if (item) {
    if (item.frequency == "Weekly") {
      return item.repeatOn;
    }
  }
};

component.state.wagePerHour = function () {
  return this.item.wagePerHour;
};

component.state.sectionsWithOutSelected = function() {
  return Sections.find({"_id": {$nin: [this.item.section]}});
};

component.action.submit = function (id, info) {
  Meteor.call("editJobItem", id, info, function (err) {
    if (err) {
      HospoHero.error(err);
    } else {
      var jobBefore = Session.get("updatingJob");
      var jobtype = JobTypes.findOne(jobBefore.type);
      if(jobtype) {
        var desc = createNotificationText(id, jobBefore, info);

        var options = {
          "type": "edit",
          "title": jobBefore.name + " " + jobtype.name + " job has been updated",
          "text": desc
        };
        Meteor.call("sendNotifications", id, "job", options, function (err) {
          if (err) {
            HospoHero.error(err);
          } else {
            var goback = Session.get("goBackMenu");
            if (goback) {
              Router.go("menuItemDetail", {"_id": goback});
            }
          }
        });

        Router.go("jobItemDetailed", {"_id": id});
      }
    }
  });
};

component.state.isArchive = function() {
  var id = Router.current().params._id;
  if (id) {
    var item = JobItems.findOne(id);
    if(item) {
      return item.status == "archived";
    }
  }
};

component.prototype.onFormRendered = function() {
  Session.set("localId", updateLocalJobItem());
};

updateLocalJobItem = function() {
  var jobItemId = Session.get("thisJobItem");
  LocalJobItem.remove({});
  if(jobItemId) {
    var jobItem = JobItems.findOne(jobItemId);
    if(jobItem) {
      var type = jobItem.type;
      var itemType = JobTypes.findOne(type);
      if(itemType && itemType.name == "Prep") {
        var ings = [];
        if(jobItem.ingredients && jobItem.ingredients.length > 0) {
          jobItem.ingredients.forEach(function(item) {
            if(ings.indexOf(item._id) < 0) {
              ings.push(item._id);
            }
          });
        }
        return LocalJobItem.insert({"_id": jobItemId, "type": type, "ings": ings});
      }
    }
  }
};

component.prototype.onFormRendered = function() {
  Session.set("localId", updateLocalJobItem());
};

updateLocalJobItem = function() {
  var jobItemId = Session.get("thisJobItem");
  LocalJobItem.remove({});
  if(jobItemId) {
    var jobItem = JobItems.findOne(jobItemId);
    if(jobItem) {
      var type = jobItem.type;
      var itemType = JobTypes.findOne(type);
      if(itemType && itemType.name == "Prep") {
        var ings = [];
        if(jobItem.ingredients && jobItem.ingredients.length > 0) {
          jobItem.ingredients.forEach(function(item) {
            if(ings.indexOf(item._id) < 0) {
              ings.push(item._id);
            }
          });
        }
        return LocalJobItem.insert({"_id": jobItemId, "type": type, "ings": ings});
      }
    }
  }
};