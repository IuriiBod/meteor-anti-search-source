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
    var cursors = [];
    subs.subscribe("menuList", "all", "all")

    return cursors;
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
          HospoHero.alert(err);
        }
      });
    }
  },
  fastRender: true
});