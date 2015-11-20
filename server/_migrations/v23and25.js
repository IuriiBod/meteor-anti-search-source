resetPredictionData = function () {
  DailySales.remove({});
  Locations.update({}, {$unset: {lastForecastModelUploadDate: ''}}, {multi: true});
  MenuItems.update({}, {$set: {isNotSyncedWithPos: false}}, {multi: true});
};

Migrations.add({
  version: 23,
  name: "Reset forecast data",
  up: resetPredictionData
});

Migrations.add({
  version: 25,
  name: "Reset forecast data",
  up: resetPredictionData
});