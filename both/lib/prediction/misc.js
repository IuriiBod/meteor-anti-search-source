Namespace('HospoHero.prediction', {
  getMenuItemByPosName: function (menuItemName, locationId) {
    return MenuItems.findOne({
      'relations.locationId': locationId,
      $or: [{posNames: {$all:[menuItemName]}}, {name: menuItemName}]
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