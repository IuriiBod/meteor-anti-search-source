Router.route('menuItemsMaster', {
  path: '/menuItems/:category/:status',
  template: "menuItemsListMainView",
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('allCategories', currentAreaId),
      Meteor.subscribe('menuList', currentAreaId, this.params.category, this.params.status.toLowerCase()),
      Meteor.subscribe('userSubscriptions', currentAreaId)
    ];
  },
  data: function () {
    return {
      category: this.params.category,
      status: this.params.status.toLowerCase()
    };
  }
});


Router.route('menuItemDetail', {
  path: '/menuItem/:_id',
  template: "menuItemDetailedMainView",
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    if (currentAreaId) {
      return [
        Meteor.subscribe('menuItem', this.params._id, currentAreaId),
        Meteor.subscribe('comments', this.params._id, currentAreaId),
        Meteor.subscribe('allSuppliers', currentAreaId),
        Meteor.subscribe('allCategories', currentAreaId),
        Meteor.subscribe('userSubscriptions', currentAreaId),
        Meteor.subscribe('areaUsersList', currentAreaId),
        Meteor.subscribe('jobTypes'),
        Meteor.subscribe('allIngredientsInArea', currentAreaId),
        Meteor.subscribe('jobItemsInArea', currentAreaId,null),
        Meteor.subscribe('taskList')
      ];
    }
  },
  data: function () {
    return MenuItems.findOne({_id: this.params._id});
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
      Meteor.subscribe('allIngredientsInArea', currentAreaId),
      Meteor.subscribe('jobTypes')
    ];
  }
});
