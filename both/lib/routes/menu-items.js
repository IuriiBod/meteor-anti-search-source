Router.route('menuItemsMaster', {
  path: '/menuItems/:category/:status',
  template: "menuItemsListMainView",
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('allCategories', currentAreaId),
      //Meteor.subscribe('menuList', currentAreaId, this.params.category, this.params.status.toLowerCase()),
      Meteor.subscribe('userSubscriptions', currentAreaId)
    ];
  },
  data: function () {
    return {
      category: this.params.category.toLowerCase(),
      status: this.params.status.toLowerCase()
    }
  }
});

Router.route('submitMenuItem', {
  path: '/menuItems/submit',
  template: "menuItemSubmitMainView",
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('allCategories', currentAreaId),
      Meteor.subscribe('allSuppliers', currentAreaId),
      Meteor.subscribe('ingredients', null, currentAreaId),
      Meteor.subscribe('jobTypes'),
      Meteor.subscribe('jobItems', null, currentAreaId)
    ];
  }
});

Router.route('menuItemDetail', {
  path: '/menuItem/:_id',
  template: "menuItemDetailedMainView",
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('menuItem', this.params._id),
      Meteor.subscribe('comments', this.params._id, currentAreaId),
      Meteor.subscribe('allSuppliers', currentAreaId),
      Meteor.subscribe('allCategories', currentAreaId),
      Meteor.subscribe('userSubscriptions', currentAreaId),
      Meteor.subscribe('usersList', currentAreaId),
      Meteor.subscribe('jobTypes'),
      Meteor.subscribe('ingredients', null, currentAreaId)
    ];
  },
  data: function () {
    return MenuItems.findOne({_id: this.params._id});
  }
});