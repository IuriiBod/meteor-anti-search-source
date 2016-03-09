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

  /**
   * Checks if stocktake main is filled
   *
   * @param stocktakeMainId
   * @returns {boolean}
   * @private
   */
  _hasStocktakes(stocktakeMainId) {
    return !!Stocktakes.findOne({version: stocktakeMainId}, this._queryOptions());
  }

  _getStocktakeMainById(stocktakeMainId) {
    let currentStocktakeMainQuery = this._stocktakeMainQuery(stocktakeMainId ? {_id: stocktakeMainId} : {});
    return StocktakeMain.findOne(currentStocktakeMainQuery, this._queryOptions());
  }

  _filledStocktakeMain(stocktakeMainId, forceNext = false) {
    let currentStocktakeMain = this._getStocktakeMainById(stocktakeMainId);

    while (currentStocktakeMain && (!this._hasStocktakes(currentStocktakeMain._id) || forceNext)) {
      let nextStocktakeMainQuery = this._stocktakeMainQuery({date: {$lt: currentStocktakeMain.date}});
      currentStocktakeMain = StocktakeMain.findOne(nextStocktakeMainQuery, this._queryOptions());

      forceNext = false; //disable force next after first iteration
    }

    return currentStocktakeMain;
  }

  _getStocktakeGroup(stocktakeMainId, forceNext) {
    //ensure stocktake is filled otherwise find next filled stocktake
    let stocktakeMain = this._filledStocktakeMain(stocktakeMainId, forceNext);

    if (stocktakeMain) {
      let stocktakesCursor = Stocktakes.find({version: stocktakeMain._id}, this._queryOptions());
      return {
        stocktakeMainId: stocktakeMain._id,
        group: stocktakesCursor.fetch()
      };
    }
  }

  getCurrentStocktakeGroup(currentStocktakeMainId = false) {
    return this._getStocktakeGroup(currentStocktakeMainId, false);
  }

  getNextStocktakeGroup(currentStocktakeMainId = false) {
    return this._getStocktakeGroup(currentStocktakeMainId, true);
  }
};


let getReportForStocktakeMain = function (areaId, stocktakeMainId) {
  let stocktakeIterator = new StockTakeIterator(areaId);
  let firstStocktake = stocktakeIterator.getCurrentStocktakeGroup(stocktakeMainId);

  if (firstStocktake) {
    let secondStocktake = stocktakeIterator.getNextStocktakeGroup(firstStocktake.stocktakeMainId);

    if (secondStocktake) {
      let stocktakesReporter = new StocktakesReporter(firstStocktake.group, secondStocktake.group, areaId);
      return {
        report: stocktakesReporter.getReport()
      };
    }
  }
};

let getDetailedReportStockTakeTotal = (areaId, params) => {
  let stocktakes = Stocktakes.find({version: params.stocktakeMainId}, {sort: {date: -1}}).fetch();
  let stocktakeTotalDetailedReport = new StocktakeTotalDetailedReport(stocktakes, areaId, params);
  
  return stocktakeTotalDetailedReport.getIngredientsOfCurrentStocktake();
};

let stockVarianceReport = (currentAreaId, params) => {
  let getStocktakeGroup = (date) => Stocktakes.find({date: date}).fetch();
  let firstStocktakeGroup = getStocktakeGroup(params.firstStocktakeDate);
  let secondStocktakeGroup = getStocktakeGroup(params.secondStocktakeDate);

  let stockVarianceReport = new StockVarianceReport(
      currentAreaId,
      firstStocktakeGroup,
      secondStocktakeGroup,
      params.supplierId,
      params.searchText
  );
  return stockVarianceReport.getReport();
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
  },

  getStocktakeTotalValueDetails(params) {
    check(params, {
      stocktakeMainId: HospoHero.checkers.MongoId,
      supplierId: HospoHero.checkers.NullableMongoId,
      searchText: Match.OneOf(String, null)
    });

    if (this.userId) {
      let currentAreaId = HospoHero.getCurrentAreaId(this.userId);
      if (currentAreaId) {
        return getDetailedReportStockTakeTotal(currentAreaId, params);
      }
    } else {
      throw new Meteor.Error('Not authorized.');
    }
  },

  getStockVarianceReport(params) {
    check(params, {
      firstStocktakeDate: Object,
      secondStocktakeDate: Object,
      supplierId: HospoHero.checkers.NullableMongoId,
      searchText: Match.OneOf(String, null)
    });

    if (this.userId) {
      let currentAreaId = HospoHero.getCurrentAreaId(this.userId);
      if (currentAreaId) {
        return stockVarianceReport(currentAreaId, params);
      }
    } else {
      throw new Meteor.Error('Not authorized.');
    }
  }
});