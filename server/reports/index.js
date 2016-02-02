let StockTakeIterator = class {
  constructor(areaId) {
    this._areaId = areaId;
  }

  _stocktakeMainQuery(query = {}) {
    return _.extend(query, {'relations.areaId': this._areaId});
  }

  _queryOptions() {
    return {sort: {date: -1}};
  }

  _currentStocktakeMain(stocktakeMainId) {
    let currentStocktakeMainQuery = this._stocktakeMainQuery(stocktakeMainId ? {_id: stocktakeMainId} : {});
    return StocktakeMain.findOne(currentStocktakeMainQuery, this._queryOptions());
  }

  _nextStocktakeMain(currentStocktakeMainId) {
    let nextStocktakeMain;
    //todo: avoiding empty array: needs to be tested
    while (true) {
      let currentStocktakeMain = this._currentStocktakeMain(currentStocktakeMainId);
      let nextStocktakeMainQuery = this._stocktakeMainQuery({date: {$lt: currentStocktakeMain.date}});

      nextStocktakeMain = StocktakeMain.findOne(nextStocktakeMainQuery, this._queryOptions());

      if (!nextStocktakeMain) {
        nextStocktakeMain = false;
        break;
      }
      if (Stocktakes.findOne({version: currentStocktakeMainId}, this._queryOptions())) {
        break;
      }
    }
  }


  _getStocktakeGroup(stocktakeMainId) {
    if (stocktakeMainId) {
      let stocktakesCursor = Stocktakes.find({version: stocktakeMainId}, this._queryOptions());
      return {
        stocktakeMainId: stocktakeMainId,
        group: stocktakesCursor.fetch()
      };
    } else {
      return false;
    }
  }

  getCurrentStocktakeGroup(currentStocktakeMainId = false) {
    let currentStocktakeMain = this._currentStocktakeMain(currentStocktakeMainId);
    return this._getStocktakeGroup(currentStocktakeMain._id);
  }

  getNextStocktakeGroup(currentStocktakeMainId = false) {
    let nextStocktakeMain = this._nextStocktakeMain(currentStocktakeMainId);
    return nextStocktakeMain && this._getStocktakeGroup(nextStocktakeMain._id);
  }
};


let getReportForStocktakeMain = function (areaId, stocktakeMainId) {
  let stocktakeIterator = new StockTakeIterator(areaId);
  let firstStocktake = stocktakeIterator.getCurrentStocktakeGroup(stocktakeMainId);

  console.log('frist', firstStocktake);

  if (firstStocktake) {
    let secondStocktake = stocktakeIterator.getNextStocktakeGroup(firstStocktake.stocktakeMainId);

    console.log('2nd', secondStocktake);

    if (secondStocktake) {
      let stocktakesReporter = new StocktakesReporter(firstStocktake.group, secondStocktake.group);
      return stocktakesReporter.getReport();
    }
  }
};

Meteor.methods({
  /**
   * @param {String|null} firstStocktakeMainId stocktake ID to start from
   * @returns {*}
   */
  getNextStocktakeReport: function (firstStocktakeMainId) {
    check(firstStocktakeMainId, HospoHero.checkers.NullableMongoId);

    if (this.userId) {
      let currentAreaId = HospoHero.getCurrentAreaId(this.userId);
      if (currentAreaId) {
        return getReportForStocktakeMain(currentAreaId, firstStocktakeMainId);
      }
    } else {
      throw new Meteor.Error('Not authorized.');
    }
  }
});