Meteor.methods({
  getStocktakesReport: function (...stocktakes) {
    let stocktakesReporter = new StocktakesReporter(stocktakes);
    return stocktakesReporter.getStocktakesReport();
  }
});