resetPredictionData = function () {
  DailySales.remove({});
  Locations.update({}, {$unset: {lastForecastModelUploadDate: ''}}, {multi: true});
};

Migrations.add({
  version: 23,
  name: "Reset forecast data",
  up: resetPredictionData
});
