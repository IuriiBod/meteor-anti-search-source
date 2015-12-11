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
      assignedTo: Meteor.userId(),
      published: true,
      startTime: {$gte: new Date()},
      'relations.areaId': HospoHero.getCurrentAreaId()
    }, {sort: {startTime: 1}}).fetch();
  } else if (state == "past") {
    shifts = Shifts.find({
      assignedTo: Meteor.userId(),
      startTime: {$lte: HospoHero.dateUtils.shiftDate()},
      "relations.areaId": HospoHero.getCurrentAreaId()
    }, {sort: {startTime: -1}}).fetch();
  } else if (state == "open") {
    shifts = Shifts.find({
      assignedTo: {$in: [null, undefined]},
      published: true,
      startTime: {$gte: new Date()},
      "relations.areaId": HospoHero.getCurrentAreaId()
    }, {sort: {startTime: 1}}).fetch();
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