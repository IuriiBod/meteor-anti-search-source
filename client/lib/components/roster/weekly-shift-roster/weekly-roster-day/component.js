var component = FlowComponents.define("weeklyRosterDay", function (props) {
  this.type = props.type;
  this.set('currentDate', props.currentDate);
});

component.state.hasTemplateType = function () {
  return this.type === 'template';
};

component.state.shifts = function () {
  var shiftDate = HospoHero.dateUtils.shiftDate(this.get('currentDate'), this.get('hasTemplateType'));

  return Shifts.find({
    "shiftDate": TimeRangeQueryBuilder.forDay(shiftDate),
    "type": this.type,
    "relations.areaId": HospoHero.getCurrentAreaId()
  }, {
    sort: {"order": 1}
  });
};

component.action.addShift = function () {
  var zeroMoment = moment('00:00:00', 'HH:mm:ss');
  var startHour = 8, endHour = 17;

  var newShiftInfo = {
    startTime: new Date(zeroMoment.hours(startHour)),
    endTime: new Date(zeroMoment.hours(endHour)),
    shiftDate: HospoHero.dateUtils.shiftDate(this.get('currentDate'), this.get('hasTemplateType')),
    type: this.type
  };
  Meteor.call("createShift", newShiftInfo, HospoHero.handleMethodResult());
};