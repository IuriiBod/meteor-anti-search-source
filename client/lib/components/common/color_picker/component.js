var component = FlowComponents.define('colorPicker', function (props) {
  var defaultColor = 'rgb(97, 189, 79)';

  var checkedColor = props.checkedColor ? props.checkedColor : defaultColor;
  this.set('checkedColor', checkedColor);
  this.onColorChange = props.onColorChange;

  if(!props.checkedColor) {
    this.onColorChange(this.get('checkedColor'));
  }
});

component.state.areaColors = function () {
  return [
    'rgb(97, 189, 79)',
    'rgb(242, 214, 0)',
    'rgb(255, 171, 74)',
    'rgb(235, 90, 70)',
    'rgb(195, 119, 224)',
    'rgb(0, 121, 191)',
    'rgb(0, 194, 224)',
    'rgb(81, 232, 152)',
    'rgb(255, 128, 206)',
    'rgb(77, 77, 77)',
    'rgb(182, 187, 191)'
  ];
};

component.state.onColorCheck = function () {
  var self = this;
  return function(color) {
    self.set('checkedColor', color);
    self.onColorChange(color);
  }
};