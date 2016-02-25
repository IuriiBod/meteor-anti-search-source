Template.managerCalendar.helpers({
  users: function () {
    var areaId = HospoHero.getCurrentAreaId();
    if (areaId) {
      var assignedUsers = Shifts.find({
        startTime: TimeRangeQueryBuilder.forDay(this.date),
        assignedTo: {
          $ne: null
        },
        'relations.areaId': areaId
      }, {
        sort: {
          'profile.firstname': 1
        }
      }).map(shift => shift.assignedTo);

      return _.map(_.uniq(assignedUsers), function (userId) {
        return {
          id: userId,
          title: HospoHero.username(userId)
        };
      });
    }
  }
});