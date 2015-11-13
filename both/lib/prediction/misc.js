Namespace('HospoHero.prediction', {
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

  getMenuItemsForPredictionQuery: function (params, withPosNamesOnly) {
    var query = [{
      $and: {status: {$ne: "ideas"}}
    }];

    if (withPosNamesOnly) {
      //has at least one pos name
      query[0].$and.posNames = {$not: {$size: 0}, $exists: true};
    }

    if (_.isObject(params)) {
      query.push(params);
    }

    return query;
  }
});