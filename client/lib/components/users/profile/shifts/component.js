var component = FlowComponents.define("rosteredShifts", function (props) {
  this.set("id", props.id);
});

component.state.rosteredForShifts = function () {
  var id = this.get("id");
  var user = Meteor.users.findOne(id);
  if (user) {
    return Shifts.find({
      "assignedTo": id,
      "shiftDate": {$gte: HospoHero.dateUtils.shiftDate()}
    }, {sort: {"shiftDate": 1}});
  }
};

component.state.openedShifts = function () {
  var id = this.get("id");
  var user = Meteor.user();

  if (id == user._id) {
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
};
