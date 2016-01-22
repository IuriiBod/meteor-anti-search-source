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
  path: '/menu-items/items-rank-report',
  template: 'menuListRankReport',
  waitOn: function() {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    var formattedDate = TimeRangeQueryBuilder.forDay(HospoHero.dateUtils.formatDate(moment('Sun Jan 17 2016 13:37:22 GMT+0200 (EET)'), 'YYYY-MM-DD'));
    console.log(formattedDate);
    return [
      Meteor.subscribe('menuList', currentAreaId, 'all', 'all'),
      Meteor.subscribe('dailySales', formattedDate, currentAreaId),
      Meteor.subscribe('ingredients', null, currentAreaId),
      Meteor.subscribe('jobItems', null, currentAreaId)

      //Meteor.subscribe('menuList', currentAreaId, this.params.category, this.params.status.toLowerCase()),
    ];
  }
});

Router.route('menuItemsReportByDate', {
  path: '/menu-items/items-rank-report/:date',
  template: 'menuListRankReport',
  data: function () {
    console.log(this.params.date);
  }
});

Router.route('menuItemsReportByDateRange', {
  path: '/menu-items/items-rank-report/:startDate/:endDate',
  template: 'menuListRankReport',
  waitOn: function () {
    var timeInterval = TimeRangeQueryBuilder.forInterval(this.params.startDate, this.params.endDate);
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('menuItemsSales', timeInterval, currentAreaId, 'all', 'all')
    ]
  },
  data: function () {
    console.log(this.params.startDate);
    console.log(this.params.endDate);
    console.log(MenuItems.find().fetch());
  }
});

