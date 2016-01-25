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
    }
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
      Meteor.subscribe('ingredients', null, currentAreaId),
      Meteor.subscribe('jobItems', null, currentAreaId)
    ];
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
      Meteor.subscribe('ingredients', null, currentAreaId),
      Meteor.subscribe('jobTypes')
    ];
  }
});

Router.route('menuItemsRankReport', {
  path: '/menu-items/items-rank-report/:dateRange/:startDate/:endDate?',
  template: 'menuListRankReport',
  waitOn: function () {
    var timeInterval = this.params.endDate ? TimeRangeQueryBuilder.forInterval(this.params.startDate, this.params.endDate) : TimeRangeQueryBuilder.forDay(this.params.startDate);
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('menuItemsSales', timeInterval, currentAreaId, 'all', 'all')
    ]
  },
  data: function () {
    var menuItems = MenuItems.find({menuItemStats: {$exists: true}}, {sort: {'menuItemStats.totalContribution': -1}});
    return {
      menuItems: menuItems,
      menuItemsCount: menuItems.count(),
      dateRange: this.params.dateRange,
      startDate: this.params.startDate,
      endDate: this.params.endDate
    }
  }
});

