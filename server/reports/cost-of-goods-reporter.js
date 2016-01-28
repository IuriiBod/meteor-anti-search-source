CostOfGoodsReporter = class {
  /**
   * @param {string} fromDate DD/MM/YY
   * @param {string} toDate DD/MM/YY
   */
  constructor(fromDate, toDate) {
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.dateQuery = TimeRangeQueryBuilder.forInterval(moment(fromDate, 'DD/MM/YY'), moment(toDate, 'DD/MM/YY'))
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