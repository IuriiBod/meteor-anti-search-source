TimeRangeQueryBuilder = {
  _buildQueryFor: function (unitStr, date) {
    var start = moment(date).startOf(unitStr);
    var end = moment(date).endOf(unitStr);
    return {$gte: start.toDate(), $lte: end.toDate()};
  },

  forWeek: function (date) {
    return this._buildQueryFor('isoweek', date);
  },

  forDay: function (date) {
    return this._buildQueryFor('day', date);
  }
};

Namespace('HospoHero.predictionUtils', {
  getMenuItemByRevelName: function (menuItemName) {
    //todo update code for organization
    return MenuItems.findOne({$or: [{revelName: menuItemName}, {name: menuItemName}]})
  }
});

Namespace('HospoHero.dateUtils', {
  getDateByWeekDate: function (weekDate) {
    return moment(weekDate.year, 'YYYY').week(weekDate.week).toDate()
  }
});
