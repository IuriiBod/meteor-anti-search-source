var component = FlowComponents.define('areaSettings', function(props) {});

component.state.area = function() {
  var areaId = Session.get('areaId');
  return Areas.findOne(areaId);
};