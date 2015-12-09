Template.rosteredShifts.helpers({
  rosteredForShifts: function() {
    if (this) {
      return Shifts.find({
        "assignedTo": this._id,
        "shiftDate": {$gte: HospoHero.dateUtils.shiftDate()}
      }, {sort: {"shiftDate": 1}});
    }
  },
  openedShifts: function() {
    var currentUserId = Meteor.userId();

    if (this._id === currentUserId) {
      if (this.profile.resignDate) {
        return Shifts.find({
          "assignedTo": null,
          "published": true,
          $and: [
            {"shiftDate": {$gte: HospoHero.dateUtils.shiftDate()}},
            {"shiftDate": {$lt: HospoHero.dateUtils.shiftDate(this.profile.resignDate)}}
          ]
        }, {sort: {'shiftDate': 1}}).fetch();
      } else {
        return Shifts.find({
          "assignedTo": null,
          "published": true,
          "shiftDate": {$gte: HospoHero.dateUtils.shiftDate()}
        }, {sort: {'shiftDate': 1}}).fetch();
      }
    } else {
      return Shifts.find({
        "assignedTo": null,
        "shiftDate": {$gte: HospoHero.dateUtils.shiftDate()}
      }, {sort: {"shiftDate": 1}});
    }
  }
});