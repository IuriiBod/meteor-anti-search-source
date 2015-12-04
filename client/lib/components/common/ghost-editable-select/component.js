var component = FlowComponents.define('ghostEditableSelect', function (props) {
  // props.values is an array of objects {text: 'Text', value: '0'}
  this.set('values', props.values || []);
  this.set('isInline', props.isInline || true);

  this.selected = props.selected;
  this.onValueChanged = props.onValueChanged;
});

component.state.isSelected = function (value) {
  return value === this.selected;
};

component.state.selectedText = function () {
  var self = this;
  var values = this.get('values');
  var text = '-';
  values.forEach(function (item) {
    if (self.selected === item.value) {
      text = item.text;
    }
  });
  return text;
};

component.action.setInlineMode = function (value) {
  this.set('isInline', value);
};

component.action.onValueChanged = function (value) {
  if (_.isFunction(this.onValueChanged)) {
    this.onValueChanged(value);
  }
  this.set('isInline', true);
};