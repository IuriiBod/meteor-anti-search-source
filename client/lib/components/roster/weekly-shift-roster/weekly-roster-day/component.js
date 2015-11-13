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

component.state.managerNotesCount = function () {
  return ManagerNotes.find({
    noteDate: this.get('currentDate'),
    'relations.areaId': HospoHero.getCurrentAreaId()
  }).count();
};

component.action.addShift = function () {
  var zeroMoment = moment(HospoHero.dateUtils.shiftDate(this.get('currentDate'), this.get('hasTemplateType')));

  var shiftDate = new Date(zeroMoment);
  var startHour = new Date(zeroMoment.hours(8));
  var endHour = new Date(zeroMoment.hours(17));

  var newShiftInfo = {
    startTime: startHour,
    endTime: endHour,
    shiftDate: shiftDate,
    type: this.type
  };

  Meteor.call("createShift", newShiftInfo, HospoHero.handleMethodResult());
};

component.action.openManagerNotesFlyout = function () {
  FlyoutManager.open('managerNotes', {date: this.get('currentDate')}, true);
};