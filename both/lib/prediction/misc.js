TimeRangeQueryBuilder = {
  _buildQueryFor: function (unitStr, date, inUnix) {
    var start = moment(date).startOf(unitStr);
    var end = moment(date).endOf(unitStr);
    if (inUnix) {
      return {$gte: start.toDate().getTime(), $lte: end.toDate().getTime()};
    }
    else {
      return {$gte: start.toDate(), $lte: end.toDate()};
    }
  },

  forWeek: function (date, inUnix) {
    return this._buildQueryFor('isoweek', date, inUnix);
  },

  forDay: function (date, inUnix) {
    return this._buildQueryFor('day', date, inUnix);
  }
};

Namespace('HospoHero.prediction', {
  getMenuItemByRevelName: function (menuItemName, locationId) {
    return MenuItems.findOne({
      'relations.locationId': locationId,
      $or: [{revelName: menuItemName}, {name: menuItemName}]
    })
  },

  /**
   * Check whether location can use prediction functionality
   * @param {String|Object} location to check
   * @returns {boolean}
   */
  isAvailableForLocation: function (location) {
    if (_.isString(location)) {
      location = Locations.findOne({_id: location});
    }

    return location && location.pos &&
      _.reduce(['host', 'key', 'secret'], function (isValid, property) {
        var str = location.pos[property];
        return str && str.length > 0 && isValid;
      }, true);
  },

  getMenuItemsForPredictionQuery: function (params) {
    var query = {status: {$ne: "ideas"}};

    if (_.isObject(params)) {
      _.extend(query, params);
    }
    return query;
  }
});

//todo: move merge this stuff with helpers.js after helpers.js refactoring
Namespace('HospoHero.dateUtils', {
  getDateByWeekDate: function (weekDate) {
    return moment(weekDate.year, 'YYYY').week(weekDate.week).startOf('isoweek').toDate();
  },
  getWeekDays: function (weekDate) {
    var weekStart = moment(this.getDateByWeekDate(weekDate));
    var weekDays = [];
    for (var i = 0; i < 7; i++) {
      weekDays.push(new Date(weekStart.toDate()));
      weekStart.add(1, 'day');
    }
    return weekDays;
  }
});