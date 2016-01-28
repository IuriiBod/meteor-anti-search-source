Meteor.methods({
  getStocktakesReport: function (reportsCount) {
    let result = [];
    let stocktakes = Stocktakes.find({}, {limit: reportsCount * 2}).fetch();

    for (let i = 0; i < reportsCount * 2; i += 2) {
      let stocktakesReporter = new StocktakesReporter(stocktakes[i], stocktakes[i + 1]);
      result.push(stocktakesReporter.getReport());
    }

    return result;
  }
});