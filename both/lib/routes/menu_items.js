//--------------------MENU ITEMS
Router.route('/menuItems/:category/:status', {
  name: "menuItemsMaster",
  path: '/menuItems/:category/:status',
  template: "menuItemsListMainView",
  waitOn: function() {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('allCategories', currentAreaId),
      Meteor.subscribe('allStatuses'),
      Meteor.subscribe('menuList', currentAreaId, this.params.category, this.params.status.toLowerCase()),
      Meteor.subscribe('userSubscriptions', currentAreaId)
    ];
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("category", this.params.category);
    Session.set("status", this.params.status.toLowerCase());
    Session.set("editStockTake", false);
  }
});

Router.route('/menuItems/submit', {
  name: "submitMenuItem",
  path: '/menuItems/submit',
  template: "menuItemSubmitMainView",
  waitOn: function() {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('allCategories', currentAreaId),
      Meteor.subscribe('allStatuses'),
      Meteor.subscribe('allSuppliers', currentAreaId),
      Meteor.subscribe('ingredients', null, currentAreaId),
      Meteor.subscribe('jobTypes'),
      Meteor.subscribe('jobItems', null, currentAreaId)
    ];
  },
  data: function() {
    if(!Meteor.userId() || !HospoHero.canUser('edit menus')()) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
  }
});

Router.route('/menuItems/:type', {
  name: "menuItemsMasterType",
  path: '/menuItems/:type',
  template: "menuItemsListMainView",
  waitOn: function() {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('allCategories', currentAreaId),
      Meteor.subscribe('allStatuses'),
      Meteor.subscribe('menuList', currentAreaId, 'all', 'all'),
      Meteor.subscribe('userSubscriptions', currentAreaId)
    ];
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("category", "all");
    Session.set("status", "all");
    Session.set("editStockTake", false);
  }
});

Router.route('/menuItem/:_id', {
  name: "menuItemDetail",
  path: '/menuItem/:_id',
  template: "menuItemDetailedMainView",
  waitOn: function() {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe("menuItem", this.params._id),
      Meteor.subscribe('comments', this.params._id, currentAreaId),
      Meteor.subscribe('allCategories', currentAreaId),
      Meteor.subscribe('allStatuses'),
      Meteor.subscribe('userSubscriptions', currentAreaId),
      Meteor.subscribe('usersList', currentAreaId),
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
  }
});