CostOfGoodsReporter = class {
  /**
   * @param {string} fromDate DD-MM-YYYY
   * @param {string} toDate DD-MM-YYYY
   */
  constructor(fromDate, toDate) {
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  getReport() {
    return {
      expected: {
        amount: 1203.00,
        ration: 31.83
      },
      actual: {
        amount: 1000,
        ratio: 26.46
      }
    }
  }
};