var component = FlowComponents.define('breadcrumbs', function (props) {
  this.set('heading', props.heading);
  this.set('id', props.id);
  this.set('title', props.title);
  this.type = props.type;
});

component.state.isMenuDetailed = function () {
  return this.type == 'menudetailed';
};