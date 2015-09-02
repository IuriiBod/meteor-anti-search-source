subs = new SubsManager();

Router.configure({
  layoutTemplate: 'mainLayout',
  notFoundTemplate: 'notFound',
  loadingTemplate: 'loading'
});

//--------------------HOME

Router.route("/", {
  name: "home",
  template: "home",
  path: "/",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("rosteredFutureShifts", Meteor.userId()));
    cursors.push(subs.subscribe("rosteredPastShifts", Meteor.userId()));
    cursors.push(subs.subscribe("openedShifts"));
    cursors.push(subs.subscribe("allSections"));
    cursors.push(subs.subscribe("comments", Meteor.userId()));
    cursors.push(subs.subscribe("posts"));
    cursors.push(subs.subscribe("usersList"));
    return cursors;
  }, 
  data: function() {
    if(!Meteor.userId()) {
      Router.go("signIn");
    }
    Session.set("editStockTake", false);
  },
  fastRender: true
});

//--------------------SIGN IN

Router.route('/signIn', function() {
  this.render('signIn');
  this.layout('blankLayout');
}, {
  name: "signIn",
  path: "/signIn",
  data: function() {
    if(Meteor.userId()) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
  }
});


//--------------------REGISTER

Router.route('/register', function () {
  this.render('signUp');
  this.layout('blankLayout');
}, {
  name: "signUp"
});

//--------------------PIN CODE LOCK PAGE

Router.route("/pinLock", {
  layoutTemplate: "blankLayout",
  name: "pinLock",
  path: "/pinLock",
  data: function() {
    return {
      backwardUrl: this.params.query.backwardUrl
    };
  }
});

//--------------------SWITCH USER

Router.route("/switchUser", {
  layoutTemplate: "blankLayout",
  name: "switchUser",
  template: "switchUserView",
  path: "/switchUser",
  waitOn: function() {
    var usersIds = Session.get("loggedUsers") || {};
    usersIds = _.keys(usersIds);
    return subs.subscribe("selectedUsersList", usersIds);
  }
});

//--------------------MENU ITEMS

Router.route('/menuItems/:category/:status', {
  name: "menuItemsMaster",
  path: '/menuItems/:category/:status',
  template: "menuItemsListMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("allCategories"));
    cursors.push(subs.subscribe("allStatuses"));
    cursors.push(Meteor.subscribe("menuList", this.params.category, this.params.status.toLowerCase()));
    cursors.push(subs.subscribe("userSubs", ['menulist']));
    return cursors;
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("category", this.params.category);
    Session.set("status", this.params.status.toLowerCase());
    Session.set("editStockTake", false);    
  },
  fastRender: true
});

Router.route('/menuItems/submit', {
  name: "submitMenuItem",
  path: '/menuItems/submit',
  template: "menuItemSubmitMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("allCategories"));
    cursors.push(subs.subscribe("allStatuses"));
    return cursors;
  }, 
  data: function() {
    if(!Meteor.userId() || !isManagerOrAdmin(Meteor.userId())) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
  },
  fastRender: true
});

Router.route('/menuItem/:_id', {
  name: "menuItemDetail",
  path: '/menuItem/:_id',
  template: "menuItemDetailedMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("menuItems", [this.params._id]));
    cursors.push(subs.subscribe("comments", this.params._id));
    cursors.push(subs.subscribe("allCategories"));
    cursors.push(subs.subscribe("allStatuses"));
    cursors.push(subs.subscribe("usersList"));
    cursors.push(subs.subscribe("userSubs", ['menulist', this.params._id]));
    return cursors;
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("thisMenuItem", this.params._id);
    Session.set("editStockTake", false);
  },
  fastRender: true
});

// ---------------------JOB ITEMS

Router.route('/jobItems', {
  name: "jobItemsMaster",
  path: '/jobItems',
  template: "jobItemsListMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("allJobTypes"));
    cursors.push(subs.subscribe("allSections"));
    cursors.push(subs.subscribe("userSubs", ['joblist']));
    return cursors;
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
  },
  fastRender: true
});

Router.route('/jobItem/submit', {
  name: "submitJobItem",
  path: '/jobItem/submit',
  template: "submitJobItemMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("allJobTypes"));
    cursors.push(subs.subscribe("allSections"));
    return cursors;
  },
  data: function() {
    if(!Meteor.userId() || !isManagerOrAdmin(Meteor.userId())) {
      Router.go("/");
    }
    Session.set("thisJobItem", null);
    Session.set("selectedIngredients", null);
    Session.set("editStockTake", false);
  },
  fastRender: true
});

Router.route('/jobItem/:_id', {
  name: "jobItemDetailed",
  path: '/jobItem/:_id',
  template: "jobItemDetailedMainView",
  waitOn: function() {
    var cursors = [];
    cursors = jobItemSubs(this.params._id);
    cursors.push(subs.subscribe("allJobTypes"));
    cursors.push(subs.subscribe("comments", this.params._id));
    cursors.push(subs.subscribe("usersList"));
    cursors.push(subs.subscribe("userSubs", [this.params._id, 'joblist']));
    return cursors;
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("thisJobItem", this.params._id);
    Session.set("editStockTake", false);
  },
  fastRender: true
});

Router.route('/jobItem/:_id/edit', {
  name: "jobItemEdit",
  path: '/jobItem/:_id/edit',
  template: "jobItemEditView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("allJobTypes"));
    cursors.push(jobItemSubs(this.params._id));
    cursors.push(subs.subscribe("allSections"));
    return cursors;
  },
  data: function() {
    if(!Meteor.userId() || !isManagerOrAdmin(Meteor.userId())) {
      Router.go("/");
    }
    Session.set("thisJobItem", this.params._id);
    Session.set("editStockTake", false);
  },
  fastRender: true
});


// ---------------------INGREDIENTS

Router.route('/stocklist', {
  name: "ingredientsList",
  path: '/stocklist',
  template: "listOfStocksMasterMainView",
  waitOn: function() {
    return subs.subscribe("allSuppliers");
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
  },
  fastRender: true
});

// ---------------------STOCKTAKE
Router.route('/stocktake', {
  name: "stocktakeList",
  path: '/stocktake',
  template: "stockListMainView",
  waitOn: function() {
    var cursors = [];
    return cursors;
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
  },
  fastRender: true
});

Router.route('/stocktake/:_id', {
  name: "stocktakeCounting",
  path: '/stocktake/:_id',
  template: "stocktakeCountingMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("allAreas"));
    cursors.push(subs.subscribe("allSuppliers"));
    cursors.push(subs.subscribe("stocktakes", this.params._id));
    cursors.push(subs.subscribe("ordersPlaced", this.params._id));
    return cursors;
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("activeSArea", null);
    Session.set("activeGArea", null);
    Session.set("thisVersion", this.params._id);;
    Session.set("editStockTake", false);
  },
  fastRender: true
});

Router.route('/stocktake/order/receive/:_id', {
  name: "orderReceive",
  path: '/stocktake/order/receive/:_id',
  template: "orderReceiveMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("receiptOrders", this.params._id));
    cursors.push(subs.subscribe("orderReceipts", [this.params._id]));
    return cursors;
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
    Session.set("thisReceipt", this.params._id);
  },
  fastRender: true
});

Router.route('/stocktake/orders/:_id', {
  name: "stocktakeOrdering",
  path: '/stocktake/orders/:_id',
  template: "stocktakeOrderingMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("ordersPlaced", this.params._id));
    var orders = StockOrders.find({"version": this.params._id}).fetch();
    cursors.push(subs.subscribe("orderReceiptsByVersion", this.params._id));
    cursors.push(subs.subscribe("comments", this.params._id));
    cursors.push(subs.subscribe("usersList"));
    return cursors;
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("thisVersion", this.params._id);
    Session.set("editStockTake", false);
  },
  fastRender: true
});

Router.route('/stocktake/order/receipts', {
  name: "orderReceiptsList",
  path: '/stocktake/order/receipts',
  template: "orderReceiptsListMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(Meteor.subscribe("allOrderReceipts"));
    var receipts = OrderReceipts.find({"received": true}).fetch();
    var users = [];
    if(receipts && receipts.length > 0) {
      receipts.forEach(function(receipt) {
        if(receipt.receivedBy && users.indexOf(receipt.receivedBy) < 0) {
          users.push(receipt.receivedBy);
        }
      });
    }
    cursors.push(subs.subscribe("selectedUsers", users));
    return cursors;
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("thisState", false);
    if(!Session.set("thisTime")) {
      Session.set("thisTime", "week");
    }
    Session.set("editStockTake", false);
  },
  fastRender: true
});

//-----------------SUPPLIERS LIST

Router.route('/suppliers', {
  name: "suppliersList",
  path: '/suppliers',
  template: "suppliersListMainView",
  waitOn: function() {
    var cursors = [];
    return cursors;
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
  },
  fastRender: true
});

// ---------------------SALES ROUTES
// Router.route('/sales/forecast/catering', {
//   name: "cateringSalesForecast",
//   path: '/sales/forecast/catering',
//   template: "cateringSalesForecastView",
//   waitOn: function() {
//     return subs.subscribe("menuList", null, null);
//   },
//   data: function() {
//     if(!Meteor.userId() || !isManagerOrAdmin(Meteor.userId())) {
//       Router.go("/");
//     }
//   },
//   fastRender: true
// });

Router.route('/sales/forecast/cafe/:year/:week', {
  name: "cafeSalesForecast",
  path: '/sales/forecast/cafe/:year/:week',
  template: "weeklyForecastListMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("menuList", "all", "active"));
    return cursors;
  },
  data: function() {
    if(!Meteor.userId() || !isManagerOrAdmin(Meteor.userId())) {
      Router.go("/");
    }
  },
  fastRender: true
});

Router.route('/sales/forecast/cafe/edit/:year/:week', {
  name: "weeklySalesForecastMenusList",
  path: '/sales/forecast/cafe/edit/:year/:week',
  template: "weeklySalesForecastMenusListView",
  waitOn: function() {
    return subs.subscribe("menuList", "all", "all");
  },
  data: function() {
    if(!Meteor.userId() || !isManagerOrAdmin(Meteor.userId())) {
      Router.go("/");
    }
  },
  fastRender: true
});

Router.route('/sales/calibration/:category/:status', {
  name: "salesCalibration",
  path: '/sales/calibration/:category/:status',
  template: "salesCalibratedMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("allCategories"));
    cursors.push(Meteor.subscribe("menuList", this.params.category, this.params.status.toLowerCase()));
    cursors.push(subs.subscribe("salesCalibration"));
    cursors.push(subs.subscribe("userSubs", ['menulist']));
    return cursors;
  },
  data: function() {
    if(!Meteor.userId() || !isManagerOrAdmin(Meteor.userId())) {
      Router.go("/");
    }
    Session.set("category", this.params.category);
    Session.set("status", this.params.status.toLowerCase());
    Session.set("dateRange", 1);
  },
  fastRender: true
});

Router.route('/sales/:date', {
  name: "actualSales",
  path: '/sales/:date',
  template: "actualSalesMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("menuList", null, null));
    return cursors;
  },
  data: function() {
    if(!Meteor.userId() || !isManagerOrAdmin(Meteor.userId())) {
      Router.go("/");
    } else {
      Meteor.call("createSalesMenus", this.params.date, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    }
  },
  fastRender: true
});

//-----------------ROSTER

Router.route('/roster/daily/:date', {
  name: "dailyRoster",
  path: '/roster/daily/:date',
  template: "dailyRosterMainView",
  waitOn: function() {
    if(this.params.date != null) {
      return [
        Meteor.subscribe("daily", this.params.date, null),
        subs.subscribe("workers"),
        subs.subscribe("unAssignedJobs"),
        subs.subscribe("allJobItems"),
        subs.subscribe("allSections"),
        subs.subscribe("jobTypes")
      ];
    }
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("thisDate", this.params.date);
    Session.set("editStockTake", false);
  },
  fastRender: true
});

Router.route('/roster/weekly/:year/:week', {
  name: "weeklyRoster",
  path: '/roster/weekly/:year/:week',
  template: "weeklyRosterMainView",
  waitOn: function() {
    if(this.params.week != null) {
      var cursors = [];
      cursors.push(weeklySubs(this.params.week, null));
      cursors.push(subs.subscribe("workers"));
      cursors.push(subs.subscribe("allSections"));
      var week = getWeekStartEnd(this.params.week, this.params.year);
      cursors.push(subs.subscribe("salesForecastForWeek", week.monday, week.sunday, "cafe"));
      cursors.push(subs.subscribe("actualSalesForWeek", week.monday, week.sunday, "cafe"));
      return cursors;
    }
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("thisWeek", this.params.week);
    Session.set("thisYear", this.params.year);
    Session.set("editStockTake", false);
  },
  fastRender: true
});


Router.route('/roster/template/weekly', {
  name: "templateWeeklyRoster",
  path: '/roster/template/weekly',
  template: "weeklyRosterTemplateMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("weekly", null, null, "template"));
    cursors.push(subs.subscribe("workers"));
    cursors.push(subs.subscribe("allSections"));
    return cursors;
  },
  data: function() {
    Session.set("editStockTake", false);
  },
  fastRender: true
});

Router.route('/roster/shift/:_id', {
  name: "shift",
  path: '/roster/shift/:_id',
  template: "shiftMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("shift", this.params._id));
    var shift = Shifts.findOne(this.params._id);
    var jobs = [];
    if(shift && shift.jobs.length > 0) {
      jobs = shift.jobs;
      cursors.push(subs.subscribe("jobs", jobs));
    }
    if(shift && shift.assignedTo) {
      cursors.push(subs.subscribe("profileUser", shift.assignedTo))
    }
    return cursors;
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
    Session.set("thisDate", this.params.date);
  },
  fastRender: true
});


// ---------------------ADMIN 

Router.route('/admin', {
  name: "admin",
  path: '/admin',
  template: "adminMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("usersList"));
    cursors.push(subs.subscribe("allSections"));
    cursors.push(subs.subscribe("allAreas"));
    return cursors;
  },
  data: function() {
    if(!Meteor.userId() || !isManagerOrAdmin(Meteor.userId())) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
  },
  fastRender: true
});


Router.route('/user/profile/:_id', {
  name: "profile",
  path: "/user/profile/:_id",
  template: "profileMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("profileUser", this.params._id));
    cursors.push(subs.subscribe("rosteredFutureShifts", this.params._id));
    cursors.push(subs.subscribe("openedShifts"));
    cursors.push(subs.subscribe("allSections"));
    return cursors;
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
  },
  fastRender: true
});

Router.route('/supplier/profile/:_id', {
  name: "supplierProfile",
  path: "/supplier/profile/:_id",
  template: "supplierProfileMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("supplierProfile", this.params._id));
    cursors.push(subs.subscribe("comments", this.params._id));
    cursors.push(subs.subscribe("allSuppliers"));
    return cursors;
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("thisSupplier", this.params._id);
    Session.set("editStockTake", false);
  },
  fastRender: true
});


Router.route('/jobs', {
  name: "jobs",
  path: '/jobs',
  template: "jobsMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(Meteor.subscribe("unAssignedJobs"));
    return cursors;
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
  },
  fastRender: true
});

//-------------------REPORTS

Router.route('/reports/stocktake/currentStocks/:year/:week', {
  name: "currentStocks",
  path: '/reports/stocktake/currentStocks/:year/:week',
  template: "currentStocksReportView",
  waitOn: function() {
    var cursors = [];   
    return cursors;
  },
  data: function() {
    if(!Meteor.userId() || !isManagerOrAdmin(Meteor.userId())) {
      Router.go("/");
    }
    Session.set("thisWeek", this.params.week);
    Session.set("editStockTake", false);
  },
  fastRender: true
});

Router.route('/reports/:year/:week', {
  name: "teamHours",
  path: "/reports/:year/:week",
  template: "teamHoursMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("usersList"));
    cursors.push(weeklySubs(this.params.week, null));
    return cursors;
  },
  data: function() {
    if(!Meteor.userId() || !isManagerOrAdmin(Meteor.userId())) {
      Router.go("/");
    }
    Session.set("reportHash", this.params.hash)
    Session.set("editStockTake", false);
    Session.set("thisYear", this.params.year);
    Session.set("thisWeek", this.params.week);
  },
  fastRender: true
});

// Router.route('/member/:_id/:date', {
//   name: "member",
//   path: '/member/:_id/:date',
//   template: "teamMemberJobView",
//   waitOn: function() {
//     return Meteor.subscribe("daily", this.params.date, this.params._id);
//   },
//   data: function() {
//     Session.set("thisDate", this.params.date);
//     Session.set("thisWorker", this.params._id);
//   }
// });


function weeklySubs(week, type) {
  var dates = getWeekStartEnd(week);
  var cursors = [];
  var weeklyShiftsSub = subs.subscribe("weekly", dates, null, type);
  cursors.push(weeklyShiftsSub);
  return cursors;
}

function jobItemSubs(id) {
  var cursors = [];
  var jobItemCursor = subs.subscribe("jobItems", [id]);
  cursors.push(jobItemCursor);
  if(jobItemCursor) {
    var jobItem = JobItems.findOne(id);
    if(jobItem) {
      if(jobItem.ingredients) {
        var ids = [];
        jobItem.ingredients.forEach(function(doc) {
          ids.push(doc._id);
        });
        if(ids.length > 0) {
          cursors.push(subs.subscribe("ingredients", ids))
        }
      }
      if(jobItem.section) {
        cursors.push(subs.subscribe("section", jobItem.section));
      }
    }
  } 
  return cursors;
}

function menuItemSubs(id) {
  var cursors = [];
  var menuItemCursor = Meteor.subscribe("menuItem", id);
  cursors.push(menuItemCursor);
  if(menuItemCursor) {
    var menuItem = MenuItems.findOne(id);
    if(menuItem) {
      if(menuItem.ingredients) {
        var ids = [];
        menuItem.ingredients.forEach(function(doc) {
          ids.push(doc._id);
        });
        if(ids.length > 0) {
          cursors.push(subs.subscribe("ingredients", ids))
        }
      }
      // if(menuItem.jobItems) {
      //   var jobIds = [];
      //   menuItem.jobItems.forEach(function(doc) {
      //     jobIds.push(doc._id);
      //   });
      //   if(jobIds.length > 0) {
      //     cursors.push(Meteor.subscribe("menuItemJobItems", jobIds));
      //   }
      // }
    }
  }  
  cursors.push(subs.subscribe("allJobItems"));
  cursors.push(subs.subscribe("allCategories"));
  cursors.push(subs.subscribe("allStatuses"));
  cursors.push(subs.subscribe("allIngredients"));
  return cursors;
}

