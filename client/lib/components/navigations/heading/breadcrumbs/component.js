var component = FlowComponents.define('breadcrumbs', function (props) {
  this.type = props.type;
  this.set('id', props.id);

  console.log('PROP', props);

  this.set('test', props.test);
});

component.state.isMenuDetailed = function () {
  return this.type == 'menudetailed';
};