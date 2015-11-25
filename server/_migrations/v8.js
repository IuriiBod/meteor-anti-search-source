Migrations.add({
  version: 8,
  name: "WeatherForecast cleaning",
  up: function () {
    WeatherForecast.remove({});
  }
});