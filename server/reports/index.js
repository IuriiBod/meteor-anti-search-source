Meteor.methods({
  getStocktakesReport: function (reportsCount) {
    let result = [];
    let stocktakesGroups = StocktakesReporter.getLastNStocktakes(reportsCount * 2);

    for (let i = 0; i < reportsCount * 2; i += 2) {
      let stocktakesReporter = new StocktakesReporter(stocktakesGroups[i], stocktakesGroups[i + 1]);
      result.push(stocktakesReporter.getReport());
    }

    return result;
  }
});