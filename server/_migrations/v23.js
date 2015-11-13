Migrations.add({
  version: 23,
  name: "Reset forecast data",
  up: function () {
    DailySales.remove({});
    Locations.update({}, {$unset: {lastForecastModelUploadDate: ''}}, {multi: true});
  }
});
