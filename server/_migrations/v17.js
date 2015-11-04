var migrationFn = function () {
  DailySales.update({}, {
    $unset: {
      predictionQuantity: '',
      predictionUpdatedAt: ''
    }
  }, {multi: true});
};


Migrations.add({
  version: 17,
  name: "Remove forecasted sales",
  up: migrationFn
});
