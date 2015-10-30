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