Migrations.add({
  version: 29,
  name: "Daily sales structure improvement",
  up: function () {
    DailySales.find({isPredictionManual: true}).forEach(function (sale) {
      DailySales.update({_id: sale._id}, {
        $set: {
          manualPredictionQuantity: sale.predictionQuantity
        },
        $unset: {
          isPredictionManual: ''
        }
      });
    });
  }
});
