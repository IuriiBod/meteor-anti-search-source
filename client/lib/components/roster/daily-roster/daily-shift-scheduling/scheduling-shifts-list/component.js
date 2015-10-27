var component = FlowComponents.define("schedulingShiftsList", function(props) {});

component.state.shiftsList = function() {
  return Shifts.find({
    "relations.areaId": HospoHero.getCurrentAreaId()
  }).fetch();
};

component.state.shiftsCount = function() {
  var date = HospoHero.dateUtils.shiftDate(Session.get("thisDate"));
  date = new Date(date).getTime();
  return Shifts.find({
    shiftDate: date,
    "relations.areaId": HospoHero.getCurrentAreaId()
  }).count() > 0;
};