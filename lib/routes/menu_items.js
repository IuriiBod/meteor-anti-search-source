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

Router.route('/menuItems/:type', {
  name: "menuItemsMasterType",
  path: '/menuItems/:type',
  template: "menuItemsListMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("allCategories"));
    cursors.push(subs.subscribe("allStatuses"));
    cursors.push(Meteor.subscribe("menuList", "all", "all"));
    cursors.push(subs.subscribe("userSubs", ['menulist']));

    return cursors;
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