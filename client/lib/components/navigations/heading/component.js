var component = FlowComponents.define("pageHeading", function (props) {
  this.title = props.title;
  this.category = props.category;
  this.subCategory = props.subCategory;
  this.type = props.name;
  this.id = props.id;
});

component.state.title = function () {
  var title = this.title;
  if (Router.current().params.type == "archive" || Router.current().params.status == "archived") {
    title = "Archived " + title;
  }
  return title;
};

component.state.type = function () {
  return this.type;
};

component.state.category = function () {
  return this.category;
};

component.state.subCategory = function () {
  return this.subCategory;
};

component.state.publishedOn = function () {
  if (this.type == "weeklyroster") {
    var weekNo = Session.get("thisWeek");
    var week = getDatesFromWeekNumber(parseInt(weekNo));
    var dates = [];
    week.forEach(function (day) {
      if (day && day.date) {
        dates.push(new Date(day.date).getTime())
      }
    });
    var shift = Shifts.findOne({
      "shiftDate": {$in: dates},
      "published": true,
      "relations.areaId": HospoHero.getCurrentAreaId()
    });
    if (shift && shift.publishedOn) {
      return shift.publishedOn;
    }
  }
};


component.state.id = function () {
  if (this.id) {
    return this.id;
  } else if (Router.current().params._id) {
    return Router.current().params._id;
  }
};

component.state.isMenuList = function () {
  return this.type == "menulist";
};

component.state.isActualSales = function () {
  return this.type == "actualsales";
};

component.state.isDailyRoster = function () {
  return this.type == "dailyroster";
};

component.state.routeDate = function () {
  var date = Router.current().params.date;
  if (date) {
    return date;
  }
};

component.state.isMenuListSubscribed = function () {
  if (this.type == "menulist") {
    return !!Subscriptions.findOne({"_id": "menulist", "subscribers": Meteor.userId()});
  }
};

component.state.isMenuDetailed = function () {
  return this.type == "menudetailed";
};

component.state.isJobItemDetailed = function () {
  return this.type == "jobitemdetailed";
};

component.state.isJobItemSubscribed = function () {
  var userId = Meteor.userId();
  var jobSubs = Subscriptions.findOne({"_id": Session.get("thisJobItem"), "subscribers": userId});
  return !!jobSubs;
};


component.state.isJobsList = function () {
  return this.type == "jobslist";
};

component.state.isMenuSubscribed = function () {
  if (this.type == "menudetailed") {
    var userId = Meteor.userId();
    var menuSubs = Subscriptions.findOne({"_id": Session.get("thisMenuItem"), "subscribers": userId});
    return !!menuSubs;
  }
};


component.state.isJobListSubscribed = function () {
  if (this.type == "jobslist") {
    return !!Subscriptions.findOne({"_id": "joblist", "subscribers": Meteor.userId()});
  }
};


component.state.isIngredientsList = function () {
  return this.type == "ingredientslist";
};

component.state.weeklyNavigation = function () {
  return !!(this.type == "cafeforecasting" || this.type == "teamHoursReport" || this.type == "weeklyroster" || this.type == "currentStocksReport");
};

component.state.isWeeklyTemplate = function () {
  return this.type == "weeklyrostertemplate";
};

component.state.isWeeklyRosterCreated = function () {
  if (this.type == "weeklyroster") {
    var weekNo = Router.current().params.week;
    var week = getDatesFromWeekNumber(parseInt(weekNo));
    var dates = [];
    week.forEach(function (day) {
      if (day && day.date) {
        dates.push(new Date(day.date).getTime())
      }
    });
    var shifts = Shifts.find({"shiftDate": {$in: dates}}).fetch();

    return shifts.length > 0;
  }
};

component.state.isWeeklyRosterPublished = function () {
  if (this.type == "weeklyroster") {
    var weekNo = Session.get("thisWeek");
    var week = getDatesFromWeekNumber(parseInt(weekNo));
    var dates = [];
    week.forEach(function (day) {
      if (day && day.date) {
        dates.push(new Date(day.date).getTime())
      }
    });

    return Shifts.find({
        "shiftDate": {$in: dates},
        "published": true,
        "relations.areaId": HospoHero.getCurrentAreaId()
      }).count() > 0;
  }
};

component.state.isStockTakeList = function () {
  return this.type == "stocktakeList";
};

component.state.date = function () {
  return moment().format("YYYY-MM-DD");
};

component.state.collapseIn = function () {

  return !!Session.get("collapsed");
};

component.state.isArchiveMenu = function () {
  var id = Router.current().params._id;
  var menu = MenuItems.findOne({_id: id});
  return menu ? menu.status == "archived" : false;
};


component.state.isArchiveJob = function () {
  var id = Router.current().params._id;
  var job = JobItems.findOne({_id: id});
  return job ? job.status == "archived" : false;
};

component.state.isSalesPrediction = function () {
  return this.type === 'salesPrediction';
};

component.state.getYear = function () {
  return Router.current().params.year;
};

component.state.getWeek = function () {
  return Router.current().params.week;
};

component.state.onDateChanged = function () {
  return function (weekDate) {

    Router.go(Router.current().route.getName(), weekDate);
  };
};

component.state.onAreaSelected = function () {
  var type = this.type;
  var itemId = Router.current().params._id;

  return function(areaId) {
    if(type == 'menudetailed') {
      Meteor.call("duplicateMenuItem", itemId, areaId, function (err) {
        if (err) {
          HospoHero.alert(err);
        } else {
          alertSuccess("Menu item has successfully copied!");
          $('#areaChooser').modal('hide');
        }
      });
    } else if(type == 'jobitemdetailed') {
      Meteor.call("duplicateJobItem", itemId, areaId, function (err) {
        if (err) {
          HospoHero.alert(err);
        } else {
          alertSuccess("Job item has successfully copied!");
          $('#areaChooser').modal('hide');
        }
      });
    }
  };
};