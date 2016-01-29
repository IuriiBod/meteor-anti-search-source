Namespace('HospoHero.generators', {
  StocktakeGroupsGenerator: (function *() {
    let stocktakes = Stocktakes.find({}, {sort: {date: -1}}).fetch();
    let stocktakesGroups = _.groupBy(stocktakes, 'version');
    let stocktakesGroupsByKey = _.map(_.keys(stocktakesGroups), (key) => stocktakesGroups[key]);
    let reset;

    while (stocktakesGroupsByKey.length > 0) {
      reset = yield stocktakesGroupsByKey.shift();
      if (reset) {
        stocktakesGroupsByKey = _.map(_.keys(stocktakesGroups), (key) => stocktakesGroups[key]);
      }
    }
  })(),

  StocktakeReportsGenerator: (function *() {
    let getGroup = HospoHero.generators.StocktakeGroupsGenerator;
    let firstStocktakeGroup, secondStocktakeGroup;
    let reset;

    while (!(firstStocktakeGroup = getGroup.next(reset)).done && !(secondStocktakeGroup = getGroup.next(reset)).done) {
      firstStocktakeGroup = firstStocktakeGroup.value;
      secondStocktakeGroup = secondStocktakeGroup.value;
      let stocktakesReporter = new StocktakesReporter(firstStocktakeGroup, secondStocktakeGroup);
      reset = yield stocktakesReporter.getReport();
    }
  })()
});