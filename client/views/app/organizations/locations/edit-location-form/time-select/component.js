var component = FlowComponents.define('locationTimeSelect', function (props) {
  this.set('label', props.label);
  this.set('currentTimeMoment', moment(props.time));

  this.set('hoursName', props.hoursName);
  this.set('minutesName', props.minutesName);
});

component.state.minutes = function () {
  var time = this.get('currentTimeMoment');
  return time.minutes();
};

component.state.hours = function () {
  var time = this.get('currentTimeMoment');
  return time.hours();
};


