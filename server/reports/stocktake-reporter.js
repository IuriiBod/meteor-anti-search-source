StocktakesReporter = class {
  constructor(firstStocktakeGroup, secondStocktakeGroup) {
    this.firstStocktakeGroup = firstStocktakeGroup;
    this.secondStocktakeGroup = secondStocktakeGroup;
  }

  getReport() {
    let firstStocktakeDate = moment.unix(this.firstStocktakeGroup[0].date / 1000).format('DD-MM-YYYY');
    let secondStocktakeDate = moment.unix(this.secondStocktakeGroup[0].date / 1000).format('DD-MM-YYYY');

    return {
      firstStocktake: {
        date: firstStocktakeDate,
        total: 3000
      },
      secondStocktake: {
        date: secondStocktakeDate,
        total: 2000
      },
      totalOrdersReceived: 500,
      costOfGoods: new CostOfGoodsReporter(firstStocktakeDate, secondStocktakeDate).getReport(),
      difference: {
        amount: -203,
        ratio: -5.37
      }
    }
  }
};