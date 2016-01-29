Meteor.methods({
  getNextStocktakeReport: () => {
    return HospoHero.generators.StocktakeReportsGenerator.next().value;
  }
});