var component = FlowComponents.define('selectComponent', function (props) {
  this.set('values', props.values);
  this.selected = props.selected;
  this.set('name', props.name);
});

component.state.isSelected = function (id) {
  return id == this.selected;
};