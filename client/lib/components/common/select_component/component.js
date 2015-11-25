var component = FlowComponents.define('selectComponent', function (props) {
  this.selected = props.selected;
  this.set('name', props.name);

  var values;
  if (Array.isArray(props.values) && props.values.length) {
    if (typeof props.values[0] == 'object') {
      values = props.values;
    } else {
      values = _.map(props.values, function (value) {
        return {
          value: value,
          text: value
        };
      });
    }
  } else {
    values = _.map(props.values, function (value, text) {
      return {
        value: value,
        text: text
      };
    });
  }
  this.set('values', values);
});

component.state.isSelected = function (id) {
  return id == this.selected;
};