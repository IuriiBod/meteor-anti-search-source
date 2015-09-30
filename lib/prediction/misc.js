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
