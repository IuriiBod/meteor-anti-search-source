Meteor.methods({
  initStocktakeReportGenerators: () => {
    Namespace('HospoHero.generators', {
      StocktakeGroupsGenerator: (function *() {
        let stocktakes = Stocktakes.find({}, {sort: {date: -1}}).fetch();
        let stocktakesGroups = _.groupBy(stocktakes, 'version');
        let stocktakesGroupsByKey = _.map(_.keys(stocktakesGroups), (key) => stocktakesGroups[key]);

        while (stocktakesGroupsByKey.length > 0) {
          yield stocktakesGroupsByKey.shift();
        }
      })(),

      StocktakeReportsGenerator: (function *() {
        let getGroup = HospoHero.generators.StocktakeGroupsGenerator;
        let firstStocktakeGroup, secondStocktakeGroup;

        while (!(firstStocktakeGroup = getGroup.next()).done && !(secondStocktakeGroup = getGroup.next()).done) {
          firstStocktakeGroup = firstStocktakeGroup.value;
          secondStocktakeGroup = secondStocktakeGroup.value;
          let stocktakesReporter = new StocktakesReporter(firstStocktakeGroup, secondStocktakeGroup);
          yield stocktakesReporter.getReport();
        }
      })()
    });
  },
  getNextStocktakeReport: () => {
    return HospoHero.generators.StocktakeReportsGenerator.next();
  }
});