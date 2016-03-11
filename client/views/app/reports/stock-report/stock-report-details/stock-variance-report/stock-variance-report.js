Template.stockVarianceReport.onCreated(function () {
  let makeTimeStampQueryFromDate = (date) => {
    let transformToTimeStamp = (object, key) => new Date(object[key]).getTime();
    let timeRangeQuery = TimeRangeQueryBuilder.forDay(moment(date, 'DD-MM-YY'));

    return {
      $gte: transformToTimeStamp(timeRangeQuery, '$gte'),
      $lte: transformToTimeStamp(timeRangeQuery, '$lte')
    };
  };

  this.report = new ReactiveVar();
  this.searchText = new ReactiveVar();
  this.datesToSelect = new ReactiveVar();
  this.supplier = new ReactiveVar('All Suppliers');

  this.getStockVariance = () => {
    let currentData = Template.currentData();
    let supplier = this.supplier.get();
    let searchText = this.searchText.get();

    let params = {
      firstStocktakeDate: makeTimeStampQueryFromDate(currentData.firstStocktakeDate),
      secondStocktakeDate: makeTimeStampQueryFromDate(currentData.secondStocktakeDate),
      supplierId: supplier === 'All Suppliers' ? null : supplier,
      searchText: searchText && searchText.length ? searchText : null
    };

    Meteor.call('getStockVarianceReport', params, HospoHero.handleMethodResult((result) => {
      if (result) {
        this.report.set(result);
      }
    }));
  };

  this.autorun(() => {
    this.report.set();
    this.getStockVariance();
  });
});

Template.stockVarianceReport.onRendered(function () {
  this.$('.suppliers-list').select2();
  this.$(`.first-stocktake option[value=${this.data.firstStocktakeDate}]`).attr('selected', 'selected');
});

Template.stockVarianceReport.helpers({
  stockItems() {
    let stockItems = Template.instance().report.get();
    let result;
    if (stockItems && stockItems.stocktakes) {
      let emptyStocktake = stockItems.stocktakes.first.elementsCount ? this.secondStocktakeDate : this.firstStocktakeDate;
      result = {emptyStocktake: `There's no data to compare. Stocktake by ${emptyStocktake} is empty`};
    } else {
      result = stockItems && stockItems.sort((firstItem, secondItem) => secondItem.variance - firstItem.variance);
    }
    return result;
  },

  tableHeader() {
    return ['Stock Item Name', 'Stocktake Total', 'Orders Received', 'Stocktake Total',
            'Expected COGS', 'Actual COGS', 'Variance'];
  },

  suppliers() {
    return Suppliers.find();
  },

  firstStocktakesDateSelector() {
    let stocktakesDates = _.clone(this.stocktakesDates);
    return stocktakesDates.shift() && stocktakesDates;
  },

  secondStocktakesDateSelector() {
    return Template.instance().datesToSelect.get();
  }
});

Template.stockVarianceReport.events({
  'keyup .search-stock-items': _.throttle(function (event, tmpl) {
    event.preventDefault();

    let searchText = event.target.value;
    tmpl.searchText.set(searchText);

  }, 500, {leading: false}),

  'change .suppliers-list': function (event, tmpl) {
    event.preventDefault();

    let supplierId = event.target.value;

    tmpl.$('.search-stock-items').val('');
    tmpl.supplier.set(supplierId);
    tmpl.getStockVariance();
  },

  'change .first-stocktake': function (event, tmpl) {
    let firstStocktakeDate = tmpl.$('.first-stocktake').val();
    let dates = _.clone(tmpl.data.stocktakesDates);

    tmpl.datesToSelect.set(dates.slice(0, dates.indexOf(firstStocktakeDate)));
  },

  'change .second-stocktake': function (event, tmpl) {
    let firstStocktakeDate = tmpl.$('.first-stocktake').val();
    let secondStocktakeDate = tmpl.$('.second-stocktake').val();

    Router.go('stockVarianceReport', {
      firstStocktakeDate: firstStocktakeDate,
      secondStocktakeDate: secondStocktakeDate
    });
  }
});
