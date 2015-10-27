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
  },

  forMonth: function (date, inUnix) {
    return this._buildQueryFor('month', date, inUnix);
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