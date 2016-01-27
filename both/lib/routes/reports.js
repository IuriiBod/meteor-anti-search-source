Router.route('/reports/:date', {
  name: "teamHours",
  template: "teamHoursMainView",
  waitOn: function () {
    var weekRange = HospoHero.misc.getWeekRangeQueryByRouter(this);
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('usersList', currentAreaId),
      Meteor.subscribe('weeklyRoster', weekRange, currentAreaId)
    ];
  },
  data: function () {
    return {
      date: HospoHero.getParamsFromRoute('date', this)
    }
  }
});

Router.route('menuItemsRankReport', {
  path: '/rank/:category/:rangeType/:startDate/:endDate?',
  template: 'menuListRankReport',
  waitOn: function () {
    var dateInterval = this.params.endDate ? TimeRangeQueryBuilder.forInterval(this.params.startDate, this.params.endDate) : TimeRangeQueryBuilder.forDay(this.params.startDate);
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('allCategories', currentAreaId),
      Meteor.subscribe('menuItemsSales', dateInterval, currentAreaId, 'all', 'all')
    ]
  },
  data: function () {
    var menuItems = MenuItems.find({stats: {$exists: true}}, {sort: {'stats.totalContribution': -1}});
    return {
      menuItems: menuItems,
      menuItemsCount: menuItems.count(),
      selectedCategoryId: this.params.category,
      rangeType: this.params.rangeType,
      startDate: this.params.startDate,
      endDate: this.params.endDate
    }
  }
});