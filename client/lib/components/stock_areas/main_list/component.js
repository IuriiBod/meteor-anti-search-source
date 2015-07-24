var component = FlowComponents.define("stockAreas", function() {});

component.state.areas = function() {
  var data = GeneralAreas.find();
  return data;
}