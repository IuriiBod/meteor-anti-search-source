Template.colorPicker.onCreated(function () {
  this.onColorChange = this.data.onColorChange;

  this.defaultColor = 'rgb(97, 189, 79)';
  var checkedColor = this.data.checkedColor || this.defaultColor;
  this.set('checkedColor', checkedColor);
  if (!this.data.checkedColor) {
    this.onColorChange(checkedColor);
  }
});

Template.colorPicker.helpers({
  areaColors: function () {
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
  },
  isCheckedColor: function (color) {
    return color === Template.instance().get('checkedColor');
  }
});

Template.colorPicker.events({
  'click .color-pick': function (event, tmpl) {
    var color = this.toString();
    tmpl.set('checkedColor', color);
    tmpl.onColorChange(color);
  }
});