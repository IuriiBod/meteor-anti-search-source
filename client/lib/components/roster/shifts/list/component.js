var component = FlowComponents.define("schedulingShiftsList", function(props) {});

component.state.shiftsList = function() {
  return Shifts.find({
    "relations.areaId": HospoHero.getDefaultArea()
  }).fetch();
};

component.state.shiftsCount = function() {
  var date = Session.get("thisDate");
  date = new Date(date).getTime();
  return Shifts.find({
    shiftDate: date,
    "relations.areaId": HospoHero.getDefaultArea()
  }).count() > 0;
};