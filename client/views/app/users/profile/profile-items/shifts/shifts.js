Template.rosteredShifts.onCreated(function() {
  var _id = this.data._id;
  var user = Meteor.users.findOne({_id: _id});
  this.set('user', user);
});

Template.rosteredShifts.helpers({
  rosteredForShifts: function() {
    var user = Template.instance().get('user');
    if (user) {
      return Shifts.find({
        "assignedTo": user._id,
        "shiftDate": {$gte: HospoHero.dateUtils.shiftDate()}
      }, {sort: {"shiftDate": 1}});
    }
  },
  openedShifts: function() {
    var user = Template.instance().get('user');
    var currentUserId = Meteor.userId();

    if (user._id === currentUserId) {
      if (user.profile.resignDate) {
        return Shifts.find({
          "assignedTo": null,
          "published": true,
          $and: [
            {"shiftDate": {$gte: HospoHero.dateUtils.shiftDate()}},
            {"shiftDate": {$lt: HospoHero.dateUtils.shiftDate(user.profile.resignDate)}}
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