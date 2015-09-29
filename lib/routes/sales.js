Router.route('/sales/forecast/cafe/:year/:week', {
  name: "cafeSalesForecast",
  path: '/sales/forecast/cafe/:year/:week',
  template: "weeklyForecastListMainView",
  waitOn: function() {
    return subs.subscribe("menuList", "all", "active");
  },
  data: function() {
    if(!Meteor.userId() || !HospoHero.perms.canViewForecast()) {
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
    if(!Meteor.userId() || !HospoHero.perms.canViewForecast()) {
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
    return [
      subs.subscribe("allCategories"),
      subs.subscribe("menuList", this.params.category, this.params.status.toLowerCase()),
      subs.subscribe("salesCalibration"),
      subs.subscribe("userSubs", ['menulist'])
    ];
  },
  data: function() {
    if(!Meteor.userId() || !HospoHero.perms.canViewForecast()) {
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
    return subs.subscribe("menuList", null, null);
  },
  data: function() {
    if(!Meteor.userId() || !HospoHero.perms.canViewForecast()) {
      Router.go("/");
    } else {
      Meteor.call("createSalesMenus", this.params.date, function(err) {
        if(err) {
          HospoHero.alert(err);
        }
      });
    }
  },
  fastRender: true
});