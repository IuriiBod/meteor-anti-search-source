Template.stockVarianceReport.onCreated(function () {
  let makeTimeStampQueryFromDate = (date) => {
    let transformToTimeStamp = (object, key) => new Date(object[key]).getTime();
    let timeRangeQuery = TimeRangeQueryBuilder.forDay(moment(date, 'DD-MM-YY'));

    return {
      $gte: transformToTimeStamp(timeRangeQuery, '$gte'),
      $lte: transformToTimeStamp(timeRangeQuery, '$lte')
    }
  };

  this.getStockVariance = () => {
    let params = {
      firstStocktakeDate: makeTimeStampQueryFromDate(this.data.firstStocktakeDate),
      secondStocktakeDate: makeTimeStampQueryFromDate(this.data.secondStocktakeDate)
    };

    Meteor.call('getStockVarianceReport', params, HospoHero.handleMethodResult((result) => {

    }));
  };

  this.getStockVariance();
});

Template.stockVarianceReport.helpers({
  tableHeader() {
    return ['Stock Item Name', 'Stocktake Total', 'Orders Received', 'Stocktake Total',
            'Expected COGS', 'Actual COGS', 'Variance', 'Variance %']
  }
});