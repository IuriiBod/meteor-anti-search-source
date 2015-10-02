var component = FlowComponents.define('weatherForecast', function (props) {
  this.set('forecast', WeatherForecast.findOne({date: TimeRangeQueryBuilder.forDay(props.date)}));
});

component.state.hasForecast = function () {
  return !!this.get('forecast');
};

component.state.roundedTemperature = function () {
  return Math.round(this.get('forecast').temp);
};
