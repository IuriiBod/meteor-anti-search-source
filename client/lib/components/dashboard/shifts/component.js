var component = FlowComponents.define("shiftsSummary", function (props) {
  this.set('shiftState', 'future');
});

component.state.currentShiftState = function (state) {
  return state == this.get('shiftState');
};

component.state.shifts = function () {
  var state = this.get("shiftState");
  var shifts = [];

  if (state == "future") {
    shifts = Shifts.find({
      "assignedTo": Meteor.userId(),
      "published": true,
      "shiftDate": {$gte: Date.now()},
      "relations.areaId": HospoHero.getCurrentAreaId()
    }, {sort: {'shiftDate': 1}}).fetch();
  } else if (state == "past") {
    shifts = Shifts.find({
      "assignedTo": Meteor.userId(),
      "shiftDate": {$lte: Date.now()},
      "relations.areaId": HospoHero.getCurrentAreaId()
    }, {sort: {'shiftDate': -1}}).fetch();
  } else if (state == "open") {
    var user = Meteor.user();
    if (user.profile.resignDate) {
      shifts = Shifts.find({
        "assignedTo": null,
        "published": true,
        $and: [
          {"shiftDate": {$gte: Date.now()}},
          {"shiftDate": {$lt: user.profile.resignDate}}
        ],
        "relations.areaId": HospoHero.getCurrentAreaId()
      }, {sort: {'shiftDate': 1}}).fetch();
    } else {
      shifts = Shifts.find({
        "assignedTo": null,
        "published": true,
        "shiftDate": {$gte: Date.now()},
        "relations.areaId": HospoHero.getCurrentAreaId()
      }, {sort: {'shiftDate': 1}}).fetch();
    }
  }
  return shifts;
};

component.state.shiftsCount = function () {
  var shifts = this.get('shifts');
  return shifts.length > 0;
};

component.action.changeShiftState = function (state) {
  this.set('shiftState', state);
};