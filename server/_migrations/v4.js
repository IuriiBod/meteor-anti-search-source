var removeDatabase = function (dbName) {
  Areas.rawDatabase().dropCollection(dbName, function () {
  });
};

Migrations.add({
  version: 4,
  name: "Remove redundant collection from old forecast",
  up: function () {
    removeDatabase('salesCalibration');
    removeDatabase('forecastCafe');
    removeDatabase('salesForecast');
    removeDatabase('actualSales');
    removeDatabase('sales');
  }
});
