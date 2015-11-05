var component = FlowComponents.define('singleColorPicker', function (props) {
  this.set('color', props.color);
  this.set('isCheckedColor', props.checked == props.color);
  this.onColorCheck = props.onColorCheck;
});

component.action.setColorChecked = function () {
  this.set('isCheckedColor', true);
  this.onColorCheck(this.get('color'));
};