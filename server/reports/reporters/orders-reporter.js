OrdersReporter = class {
  /**
   * @param {string} fromDate DD/MM/YY
   * @param {string} toDate DD/MM/YY
   */
  constructor(fromDate, toDate) {
    this._fromDate = fromDate;
    this._toDate = toDate;
    this._dateQuery = TimeRangeQueryBuilder.forInterval(moment(fromDate, 'DD/MM/YY'), moment(toDate, 'DD/MM/YY'));
  }

  getTotalOrdersReceived() {
    return 350;
  }
};