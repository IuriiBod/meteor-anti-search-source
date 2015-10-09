TimeRangeQueryBuilder = {
  _buildQueryFor: function (unitStr, date, inUnix) {
    var start = moment(date).startOf(unitStr);
    var end = moment(date).endOf(unitStr);
    if (inUnix){
      return {$gte: start.toDate().getTime(), $lte: end.toDate().getTime()};
    }
    else{
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

Namespace('HospoHero.predictionUtils', {
  getMenuItemByRevelName: function (menuItemName) {
    //todo update code for organization
    return MenuItems.findOne({$or: [{revelName: menuItemName}, {name: menuItemName}]})
  },
  havePos: function (locationId){
    var location = Lovations.findOne({_id: locationId});
    if(location.pos && location.pos.host.length > 0 && location.pos.key.length > 0 && location.pos.secret.length > 0){
      return true
    }
    return false
  }
});

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
