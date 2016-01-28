StocktakesReporter = class {
  constructor(...stocktakes) {
    console.log(stocktakes);
  }

  getReport() {
    return {
      firstDate: '17.01.2016',
      secondDate: '24.01.2016',
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