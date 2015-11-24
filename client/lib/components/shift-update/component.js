var component = FlowComponents.define('shitUpdateNotificationConfig', function (props) {
});

component.state.shiftUpdateHour = function () {
  var location = Locations.findOne({
    _id: HospoHero.getCurrentArea().locationId
  });

  if (location && (location.shiftUpdateHour || location.shiftUpdateHour === 0)) {
    return location.shiftUpdateHour;
  } else {
    return false;
  }
};

component.action.getShiftUpdateHour = function () {
  return this.get('shiftUpdateHour');
};