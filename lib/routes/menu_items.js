//--------------------MENU ITEMS
Router.route('/menuItems/:category/:status', {
  name: "menuItemsMaster",
  path: '/menuItems/:category/:status',
  template: "menuItemsListMainView",
  waitOn: function() {
    return [
      subs.subscribe("allCategories"),
      subs.subscribe("allStatuses"),
      subs.subscribe("menuList", this.params.category, this.params.status.toLowerCase()),
      subs.subscribe("userSubs", ['menulist'])
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
      subs.subscribe("allCategories"),
      subs.subscribe("allStatuses")
    ];
  },
  data: function() {
    if(!Meteor.userId() || !HospoHero.perms.canEditMenu()) {
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
      subs.subscribe("allCategories"),
      subs.subscribe("allStatuses"),
      subs.subscribe("menuList", "all", "all"),
      subs.subscribe("userSubs", ['menulist'])
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
      subs.subscribe("menuItems", [this.params._id]),
      subs.subscribe("comments", this.params._id),
      subs.subscribe("allCategories"),
      subs.subscribe("allStatuses"),
      subs.subscribe("usersList"),
      subs.subscribe("userSubs", ['menulist', this.params._id])
    ];
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