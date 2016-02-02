Migrations.add({
  version: 58,
  name: 'Convert date field to Date in StocktakeMain',
  up: function () {
    StocktakeMain.find({}).forEach(function (stocktake) {
      StocktakeMain.update({_id: stocktake._id}, {
        $set: {
          date: new Date(stocktake.date)
        }
      });
    });
  }
});