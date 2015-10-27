var component = FlowComponents.define('cronConfig', function(props) {});

component.state.cronInfo = function() {
  return Locations.findOne({
    _id: HospoHero.getCurrentArea().lcationId
  }, {
    fields: {
      shiftUpdateHour: 1
    }
  });
};

component.state.hours = function () {
  return HospoHero.dateUtils.hours();
};

component.state.shiftUpdateHour = function () {
  var location = Locations.findOne({
    _id: HospoHero.getCurrentArea().locationId
  });

  if(location && location.shiftUpdateHour) {
    return location.shiftUpdateHour;
  } else {
    return false;
  }
};

component.action.getShiftUpdateHour = function () {
  return this.get('shiftUpdateHour');
};