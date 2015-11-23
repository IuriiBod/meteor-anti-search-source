var component = FlowComponents.define('ghostEditable', function (props) {
  this.set('value', props.value);

  if (props.onValueChanged) {
    this.onValueChanged = props.onValueChanged;
  }
});

component.action.submitValue = function (newValue) {
  if (newValue.toString() !== this.get('value').toString()) {
    this.set('value', newValue);

    if (_.isFunction(this.onValueChanged)) {
      this.onValueChanged(newValue);
    }
  }
};