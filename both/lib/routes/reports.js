Router.route('/team-hours/:date', {
  name: "teamHours",
  template: "teamHoursMainView",
  waitOn: function () {
    let currentArea = HospoHero.getCurrentArea(Meteor.userId());
    if (currentArea) {
      let weekRange = TimeRangeQueryBuilder.forWeek(this.params.date, currentArea.locationId);

      return [
        Meteor.subscribe('areaUsersList', currentArea._id),
        Meteor.subscribe('weeklyRoster', weekRange, currentArea._id)
      ];
    }
  },
  data: function () {
    return {
      date: HospoHero.getParamsFromRoute('date', this)
    };
  }
});


Router.route('menuItemsRankReport', {
  path: '/menu-rank/:category/:rangeType/:startDate/:endDate?',
  template: 'menuListRankReport',
  waitOn: function () {
    let dateInterval;
    if (this.params.endDate) {
      dateInterval = TimeRangeQueryBuilder.forInterval(this.params.startDate, this.params.endDate);
    } else {
      dateInterval = TimeRangeQueryBuilder.forDay(this.params.startDate);
    }

    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('allCategories', currentAreaId),
      Meteor.subscribe('menuItemsSales', dateInterval, currentAreaId, 'all', 'all')
    ];
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
    };
  }
});


Router.route('/stock-report', {
  name: "stockReport",
  template: "stockReport",
  waitOn() {
    let currentAreaId = HospoHero.getCurrentAreaId();
    let datePeriod = moment().subtract(3, 'month').startOf('day').toDate();
    return [
      Meteor.subscribe('stocktakeDates', currentAreaId, datePeriod)
    ];
  }
});


Router.route('/stock-variance-report/:firstStocktakeDate/:secondStocktakeDate', {
  name: 'stockVarianceReport',
  template: 'stockVarianceReport',
  waitOn() {
    let currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    let datePeriod = moment().subtract(3, 'month').startOf('day').toDate();
    return [
      Meteor.subscribe('suppliersNamesList', currentAreaId),
      Meteor.subscribe('stocktakeDates', currentAreaId, datePeriod)
    ];
  },
  data() {
    let convertRouteParamToDate = (param) => moment(param, 'DD-MM-YY').toDate();
    return {
      firstStocktakeDate: convertRouteParamToDate(this.params.firstStocktakeDate),
      secondStocktakeDate: convertRouteParamToDate(this.params.secondStocktakeDate)
    };
  }
});


Router.route('/leave-requests', {
  name: "leaveRequests",
  template: "leaveRequests",
  waitOn() {
    const currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    this.params.itemPerPage = 5;
    return [
      Meteor.subscribe('leaveRequestsInArea', currentAreaId, this.params.itemPerPage, 'all'),
      Meteor.subscribe('unavailabilitiesInArea', currentAreaId, this.params.itemPerPage, 'all')
    ];
  },
  data() {
    return {
      itemPerPage: this.params.itemPerPage,
      filter: new ReactiveVar('all')
    };
  }
});
