var component = FlowComponents.define('reportsHeader', function (props) {
  this.set('year', props.year);
  this.set('week', props.week);
  this.set('onDateChanged', props.onDateChanged);

  // TODO: Do we need this state?
  this.set('type', 'reports');
});