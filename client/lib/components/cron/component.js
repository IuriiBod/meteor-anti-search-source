var component = FlowComponents.define('cronConfig', function(props) {});

component.state.cronInfo = function() {
  return CronConfig.findOne();
};