//--------------------MENU ITEMS
Router.route('/menuItems/:category/:status', {
  name: "menuItemsMaster",
  path: '/menuItems/:category/:status',
  template: "menuItemsListMainView",
  waitOn: function() {
    return [
      Meteor.subscribe('allCategories'),
      Meteor.subscribe('allStatuses'),
      Meteor.subscribe('menuList', this.params.category, this.params.status.toLowerCase()),
      Meteor.subscribe('userSubscriptions', HospoHero.getCurrentAreaId(Meteor.userId()))
    ];
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
    return [
      Meteor.subscribe('allCategories'),
      Meteor.subscribe('allStatuses'),
      Meteor.subscribe("allSuppliers"),
      Meteor.subscribe("ingredients"),
      Meteor.subscribe('jobTypes'),
      Meteor.subscribe('jobItems', null, HospoHero.getCurrentAreaId(Meteor.userId()))
    ];
  },
  data: function() {
    if(!Meteor.userId() || !HospoHero.canUser('edit menu')()) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
  },
  fastRender: true
});

Router.route('/menuItems/:type', {
  name: "menuItemsMasterType",
  path: '/menuItems/:type',
  template: "menuItemsListMainView",
  waitOn: function() {
    return [
      Meteor.subscribe('allCategories'),
      Meteor.subscribe("allStatuses"),
      Meteor.subscribe("menuList", "all", "all"),
      Meteor.subscribe('userSubscriptions', HospoHero.getCurrentAreaId(Meteor.userId()))
    ];
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("category", "all");
    Session.set("status", "all");
    Session.set("editStockTake", false);
  },
  fastRender: true
});

Router.route('/menuItem/:_id', {
  name: "menuItemDetail",
  path: '/menuItem/:_id',
  template: "menuItemDetailedMainView",
  waitOn: function() {
    return [
      Meteor.subscribe("menuItem", this.params._id),
      Meteor.subscribe('comments', this.params._id, HospoHero.getCurrentAreaId(Meteor.userId())),
      Meteor.subscribe("allCategories"),
      Meteor.subscribe("allStatuses"),
      Meteor.subscribe('userSubscriptions', HospoHero.getCurrentAreaId(Meteor.userId())),
      Meteor.subscribe('usersList', HospoHero.getCurrentAreaId(Meteor.userId())),
      Meteor.subscribe('jobTypes')
    ];
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    //todo: get rid of sessions later
    Session.set("thisMenuItem", this.params._id);
    Session.set("editStockTake", false);
  },
  fastRender: true
});