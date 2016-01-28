StocktakesReporter = class {
  constructor(firstStocktakeGroup, secondStocktakeGroup) {
    this.firstStocktakeGroup = firstStocktakeGroup;
    this.secondStocktakeGroup = secondStocktakeGroup;

    this._setDates();
  }

  _setDates() {
    let formatDate = HospoHero.dateUtils.formatTimestamp;
    this.fromDate = formatDate(this.firstStocktakeGroup[0].date);
    this.toDate = formatDate(this.secondStocktakeGroup[0].date);
  }

  getReport() {
    return {
      firstStocktake: {
        date: this.fromDate,
        total: 3000
      },
      secondStocktake: {
        date: this.toDate,
        total: 2000
      },
      totalOrdersReceived: 500,
      costOfGoods: new CostOfGoodsReporter(this.fromDate, this.toDate).getReport(),
      difference: {
        amount: -203,
        ratio: -5.37
      }
    }
  }
};