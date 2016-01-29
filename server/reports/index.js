Meteor.methods({
  /**
   * @param {true|false} fromTheBeginning used to reset the reports generator
   * @returns {*}
   */
  getNextStocktakeReport: (fromTheBeginning) => {
    return HospoHero.generators.StocktakeReportsGenerator.next(fromTheBeginning);
  }
});