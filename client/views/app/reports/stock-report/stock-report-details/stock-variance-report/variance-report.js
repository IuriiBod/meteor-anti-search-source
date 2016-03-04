Template.stockVarianceReport.onCreated(function () {
  this.report = new ReactiveVar();
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
      if (result) {
        this.report.set(result);
      }
    }));
  };

  this.getStockVariance();
});

Template.stockVarianceReport.helpers({
  stockItems() {
    let stockItems = Template.instance().report.get();
    return stockItems && stockItems.sort((firstItem, secondItem) => secondItem.variance - firstItem.variance);
  },

  tableHeader() {
    return ['Stock Item Name', 'Stocktake Total', 'Orders Received', 'Stocktake Total',
            'Expected COGS', 'Actual COGS', 'Variance', 'Variance %']
  }
});