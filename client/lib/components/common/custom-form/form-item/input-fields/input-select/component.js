var component = FlowComponents.define('customFormInputSelect', function (props) {
  var item = props.item;
  var defaultSelect = {
    value: null,
    options: []
  };
  item = _.defaults(item, defaultSelect);
  this.set('item', item);
});

component.state.isSelected = function (value) {
  return value === this.get('item').value;
};