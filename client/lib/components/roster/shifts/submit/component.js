var component = FlowComponents.define("submitShift", function(props) {});

component.state.today = function() {
  var date = Router.current().params.date;
  return moment(date).format("YYYY-MM-DD");
};

component.state.startTime = function() {
  var area = HospoHero.getCurrentArea();
  if(area) {
    var location = Locations.findOne({ _id: area.locationId });
    return location.openingTime;
  }
};

component.state.endTime = function() {
  var area = HospoHero.getCurrentArea();
  if(area) {
    var location = Locations.findOne({_id: area.locationId});
    return location.closingTime;
  }
};

component.state.sections = function() {
  return Sections.find({"relations.areaId": HospoHero.getCurrentAreaId()}).fetch();
};