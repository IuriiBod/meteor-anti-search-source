Namespace('HospoHero.utils', {
  /**
   * Returns value by specified path or default value
   *
   * @param {object} target
   * @param {string|Array} propertyPath
   * @param {*} [defaultValue]
   */
  getNestedProperty: function (target, propertyPath, defaultValue) {
    if (_.isString(propertyPath)) {
      propertyPath = propertyPath.split('.');
    }

    var _getPropertyValue = function (currentValue, propertyIndex) {
      if (currentValue && currentValue.hasOwnProperty && propertyIndex < propertyPath.length) {
        let nextProperty = propertyPath[propertyIndex];
        return _getPropertyValue(currentValue[nextProperty], propertyIndex + 1);
      }
      return _.isUndefined(currentValue) || propertyIndex < propertyPath.length ? defaultValue : currentValue;
    };

    return _getPropertyValue(target, 0);
  }
});