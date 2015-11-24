Migrations.add({
  version: 22,
  name: "delete weather icons from collection",
  up: function () {
    WeatherForecast.update({}, {$unset: {icon: ''}}, {multi: true});
  }
});