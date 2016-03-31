TimeRangeQueryBuilder = {
  _buildQueryFor: function (unitStr, date, location, dateFormat) {
    var start, end;

    if (location) {
      if (_.isString(location)) {
        location = Locations.findOne({_id: location}, {fields: {timezone: 1}});
      }

      if (_.isString(date) && dateFormat) {
        start = moment.tz(date, dateFormat, location.timezone).startOf(unitStr);
        end = moment.tz(date, dateFormat, location.timezone).endOf(unitStr);
      } else {
        start = moment(date).tz(location.timezone).startOf(unitStr);
        end = moment(date).tz(location.timezone).endOf(unitStr);
      }
    } else {
      start = moment(date).startOf(unitStr);
      end = moment(date).endOf(unitStr);
    }

    return {$gte: start.toDate(), $lte: end.toDate()};
  },

  /**
   *
   * @param {date|string} date basic date
   * @param {string|object} [locationId] consider using this param for timezones support on server side
   * @param {string|object} [dateFormat] format of string
   * @returns {*|{$gte, $lte}}
   */
  forWeek: function (date, locationId, dateFormat) {
    return this._buildQueryFor('isoweek', date, locationId, dateFormat);
  },

  /**
   * @param {date|string}  date basic date
   * @param {string|object} [locationId] consider using this param for timezones support on server side
   * @param {string|object} [dateFormat] format of string
   * @returns {*|{$gte, $lte}}
   */
  forDay: function (date, locationId, dateFormat) {
    return this._buildQueryFor('day', date, locationId, dateFormat);
  },

  /**
   *
   * @param {date|string} date basic date
   * @param {string|object} [locationId] consider using this param for timezones support on server side
   * @param {string|object} [dateFormat] format of string
   * @returns {*|{$gte, $lte}}
   */
  forMonth: function (date, locationId, dateFormat) {
    return this._buildQueryFor('month', date, locationId, dateFormat);
  },

  /**
   * Returns query for specified dates
   *
   * @param startDate
   * @param endDate
   * @returns {{$gte: *, $lte: *}}
   */
  forInterval: function (startDate, endDate) {
    var start = moment(startDate);
    var end = moment(endDate);
    return {$gte: start.toDate(), $lte: end.toDate()};
  }
};