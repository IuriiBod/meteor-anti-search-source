component = FlowComponents.define('jobItemDetail', function(props) {
  this.id = Router.current().params._id;
  this.set("job", getPrepItem(this.id));
});

component.state.section = function() {
  var item = this.get("job");
  return item && item.section ? Sections.findOne(item.section).name : false;
};

component.state.isPrep = function() {
  var item = this.get("job");
  if(item) {
    if(item.type) {
      var type = JobTypes.findOne(item.type);
      return !!(type && type.name == "Prep");
    }
  }
};

component.state.isRecurring = function() {
  var item = this.get("job");
  if(item) {
    if(item.type) {
      var type = JobTypes.findOne(item.type);
      return !!(type && type.name == "Recurring");
    }
  }
};

component.state.ingExists = function() {
  var item = this.get("job");
  return !!(item.ingredients && item.ingredients.length > 0);
};


component.state.isChecklist = function() {
  var item = this.get("job");
  return item && item.checklist && item.checklist.length > 0;
};

component.state.checklist = function() {
  var item = this.get("job");
  return item && item.checklist ? item.checklist : '';
};

component.state.startsOn = function() {
  var item = this.get("job");
  if(item && item.startsOn) {
    return moment(item.startsOn).format("YYYY-MM-DD");
  }
};

component.state.repeatAt = function() {
  var item = this.get("job");
  return item && item.repeatAt ? moment(item.repeatAt).format("hh:mm A") : false;
};

component.state.endsOn = function() {
  var item = this.get("job");
  var ends = null;
  if(item) {
    if(item.endsOn) {
      if(item.endsOn.on == "endsNever") {
        ends = "Never";
      } else if(item.endsOn.on == "endsAfter") {
        ends = "After " + item.endsOn.after + " occurrences"; 
      } else if(item.endsOn.on == "endsOn") {
        ends = "On " + moment(item.endsOn.lastDate).format("YYYY-MM-DD");
      }
    }
    return ends;
  }
};

component.state.isWeekly = function() {
  var item = this.get("job");
  return item ? item.frequency === "Weekly" : false;
};

component.state.isDaily = function() {
  var item = this.get("job");
  return item ? item.frequency === "Daily" : false;
};

component.state.frequency = function() {
  var item = this.get("job");
  var frequency = item.frequency;
  if (frequency === "Every X Weeks") {
    frequency = frequency.replace("X", item.step);
  }
  return frequency;
};

component.state.repeatOnDays = function() {
  var item = this.get("job");
  var repeat = null;
  if(item) {
    if(_.contains(["Every X Weeks", "Weekly"], item.frequency)) {
      if(item.repeatOn.length > 0) {
        if(item.repeatOn.length == 7) {
          repeat = "Everyday";
        } else {
          repeat = "Every " + item.repeatOn;
        }
      }
      return repeat;
    } 
  }
};


component.state.description = function() {
  var item = this.get("job");
  return item ? item.description : '';
};

component.state.labourCost = function() {
  var item = this.get("job");
  return item ? item.labourCost : 0;
};

component.state.prepCostPerPortion = function() {
  var item = this.get("job");
  return item ? item.prepCostPerPortion : 0;
};

component.state.isManagerOrAdmin = function() {
  var userId = Meteor.userId();
  return isManagerOrAdmin(userId);
};

component.state.relatedMenus = function() {
  var id = this.id;
  subs.subscribe("jobsRelatedMenus", id);
  return MenuItems.find().fetch();
};

component.state.getCategory = function(id) {
  subs.subscribe("menuCategories");
  var category = Categories.findOne({_id: id});

  return category ? category.name : '';
};