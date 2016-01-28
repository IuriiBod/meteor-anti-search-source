StocktakesReporter = class {
  constructor(firstStocktakeGroup, secondStocktakeGroup) {
    this.firstStocktakeGroup = firstStocktakeGroup;
    this.secondStocktakeGroup = secondStocktakeGroup;
  }

  getReport() {
    return {
      firstStocktake: {
        date: moment.unix(this.firstStocktakeGroup[0].date / 1000).format('DD-MM-YYYY'),
        total: 3000
      },
      secondStocktake: {
        date: moment.unix(this.secondStocktakeGroup[0].date / 1000).format('DD-MM-YYYY'),
        total: 2000
      },
      totalOrdersReceived: 500,
      costOfGoods: {
        expected: {
          amount: 1203,
          ratio: 31.83
        },
        actual: {
          amount: 1000,
          ratio: 26.46
        }
      },
      difference: {
        amount: -203,
        ratio: -5.37
      }
    }
  }
};