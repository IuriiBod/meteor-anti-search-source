StocktakesReporter = class {
  constructor(firstStockTake, secondStockTake) {
    console.log(firstStockTake, secondStockTake);
  }

  getReport() {
    return {
      firstStockTake: {
        date: '17.01.2016',
        total: 3000
      },
      secondStockTake: {
        date: '24.01.2016',
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