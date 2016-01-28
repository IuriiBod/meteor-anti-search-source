Meteor.methods({
  getStocktakesReport: function (reportsCount) {
    return StocktakeReportsProvider.getReports(reportsCount);
  }
});

StocktakeReportsProvider = class {
  static getLastNStocktakes(count) {
    let rawStocktakes = Stocktakes.find({}, {sort: {date: -1}}).fetch();
    let groupedStocktakes = _.groupBy(rawStocktakes, 'version');
    let stockTakesGroupsKeys = _.keys(groupedStocktakes).slice(0, count);
    return _.map(stockTakesGroupsKeys, (key) => groupedStocktakes[key]);
  };

  static getReports(count) {
    let results = [];
    let stocktakesGroups = this.getLastNStocktakes(count * 2);

    for (let i = 0; i < count * 2; i += 2) {
      let stocktakesReporter = new StocktakesReporter(stocktakesGroups[i], stocktakesGroups[i + 1]);
      let report = stocktakesReporter.getReport();
      results.push(report);
    }

    return results;
  }
};