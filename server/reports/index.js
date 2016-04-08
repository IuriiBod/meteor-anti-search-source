let getStocktake = (date, areaId) => {
  let query = {
    'relations.areaId': areaId
  };

  if (date) {
    query.date = date;
  }

  let stocktake = Stocktakes.findOne(query, {sort: {date: -1}});
  return stocktake && {date: stocktake.date, stockItems: StockItems.find({stocktakeId: stocktake._id}).fetch()};
};

let getStockReport = (firstStocktakeDate, secondStocktakeDate, areaId) => {
  firstStocktakeDate = firstStocktakeDate ? TimeRangeQueryBuilder.forDay(firstStocktakeDate) : firstStocktakeDate;
  let firstStocktake = getStocktake(firstStocktakeDate, areaId);

  if (firstStocktake) {
    secondStocktakeDate = secondStocktakeDate ? TimeRangeQueryBuilder.forDay(secondStocktakeDate) : {$lt: firstStocktake.date};
    let secondStocktake = getStocktake(secondStocktakeDate, areaId);

    if (secondStocktake) {
      let stocktakeGroups = firstStocktake.date > secondStocktake.date ?
          {firstStocktake: secondStocktake, secondStocktake: firstStocktake} :
          {firstStocktake: firstStocktake, secondStocktake: secondStocktake};

      let stockReport = new StocktakesReporter(stocktakeGroups, areaId);
      return stockReport.getReport();
    }
  }
};

let stocktakeTotalReport = (params, areaId) => {
  let stocktake = getStocktake(TimeRangeQueryBuilder.forDay(params.stocktakeDate), areaId);
  let stocktakeTotalReport = new StocktakeTotalReport(
      stocktake.stockItems, 
      params.supplierId, 
      params.searchText, 
      areaId
  );
  
  return stocktakeTotalReport.getIngredientsOfCurrentStocktake();
};

let stockVarianceReport = (currentAreaId, params) => {
  let firstStocktakeGroup = getStocktake(TimeRangeQueryBuilder.forDay(params.firstStocktakeDate), currentAreaId);
  let secondStocktakeGroup = getStocktake(TimeRangeQueryBuilder.forDay(params.secondStocktakeDate), currentAreaId);
  let result;

  if (firstStocktakeGroup.stockItems.length && secondStocktakeGroup.stockItems.length) {
    let stockVarianceReport = new StockVarianceReport(
      currentAreaId,
      firstStocktakeGroup,
      secondStocktakeGroup,
      params.supplierId,
      params.searchText
    );
    result = stockVarianceReport.getVarianceReport();
  } else {
    result = {
      stocktakes: {
        first: {
          elementsCount: firstStocktakeGroup.stockItems.length
        },
        second: {
          elementsCount: secondStocktakeGroup.stockItems.length
        }
      }
    };
  }

  return result;
};

Meteor.methods({
  uploadStockReport(firstDate, secondDate) {
    check(firstDate, Match.OneOf(null, Date));
    check(secondDate, Match.OneOf(null, Date));

    let currentAreaId = HospoHero.getCurrentAreaId();
    if (currentAreaId) {
      return getStockReport(firstDate, secondDate, currentAreaId);
    }
  },

  getStocktakeTotalValueDetails(params) {
    check(params, {
      stocktakeDate: Date,
      supplierId: HospoHero.checkers.NullableMongoId,
      searchText: Match.OneOf(String, null)
    });

    if (this.userId) {
      let currentAreaId = HospoHero.getCurrentAreaId(this.userId);
      if (currentAreaId) {
        return stocktakeTotalReport(params, currentAreaId);
      }
    } else {
      throw new Meteor.Error('Not authorized.');
    }
  },

  getStockVarianceReport(params) {
    check(params, {
      firstStocktakeDate: Date,
      secondStocktakeDate: Date,
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