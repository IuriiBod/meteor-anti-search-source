let stockVarianceReport = (currentAreaId, params) => {
  let getStocktakeGroup = (date) => {
    let stocktake = Stocktakes.findOne({date: date, 'relations.areaId': currentAreaId});
    return StockItems.find({stocktakeId: stocktake._id}).fetch();
  };
  let firstStocktakeGroup = getStocktakeGroup(params.firstStocktakeDate);
  let secondStocktakeGroup = getStocktakeGroup(params.secondStocktakeDate);
  let result;

  if (firstStocktakeGroup.length && secondStocktakeGroup.length) {
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
          elementsCount: firstStocktakeGroup.length
        },
        second: {
          elementsCount: secondStocktakeGroup.length
        }
      }
    };
  }

  return result;
};

Meteor.methods({
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