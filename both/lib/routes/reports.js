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
    var dateInterval;
    if (this.params.endDate) {
      dateInterval = TimeRangeQueryBuilder.forInterval(this.params.startDate, this.params.endDate);
    } else {
      dateInterval = TimeRangeQueryBuilder.forDay(this.params.startDate);
    }
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('allCategories', currentAreaId),
      Meteor.subscribe('menuItemsSales', dateInterval, currentAreaId, 'all', 'all')
    ]
  },
  data: function () {
    return {
      menuItemsCount: MenuItems.find().count(),
      selectedCategoryId: this.params.category,
      rangeType: this.params.rangeType,
      startDate: this.params.startDate,
      endDate: this.params.endDate
    }
  }
});