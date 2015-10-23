var daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

var component = FlowComponents.define("weeklyRosterDay", function (props) {
  this.type = props.type;
  this.set('currentDate', props.currentDate);
});

component.state.hasTemplateType = function () {
  return this.type === 'template';
};

component.state.shifts = function () {
  return Shifts.find({
    "shiftDate": HospoHero.dateUtils.shiftDate(),
    "type": this.type,
    "relations.areaId": HospoHero.getCurrentAreaId()
  }, {
    sort: {"order": 1}
  });
};

component.action.addShift = function () {
  var newShiftInfo = {
    startTime: new Date().setHours(8, 0),
    endTime: new Date().setHours(17, 0),
    shiftDate: HospoHero.dateUtils.shiftDate(null, this.get('hasTemplateType')),
    type: this.type
  };
  Meteor.call("createShift", newShiftInfo, HospoHero.handleMethodResult());
};