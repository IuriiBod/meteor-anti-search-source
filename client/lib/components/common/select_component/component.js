var component = FlowComponents.define('selectComponent', function (props) {
  if (!_.isArray(props.values)){
    var values = _.map(props.values, function (value, title) {
      return {
        value: title,
        title: title
      }
    });
    this.set('values', values);
  }else{
    this.set('values', props.values);
  }
  this.selected = props.selected;
  this.set('name', props.name);
});

component.state.isSelected = function (id) {
  return id == this.selected;
};