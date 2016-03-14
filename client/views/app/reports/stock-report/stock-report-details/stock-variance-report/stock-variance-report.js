Template.stockVarianceReport.onCreated(function () {
  let makeTimeStampQueryFromDate = (date) => {
    let transformToTimeStamp = (object, key) => new Date(object[key]).getTime();
    let timeRangeQuery = TimeRangeQueryBuilder.forDay(moment(date, 'DD-MM-YY'));

    return {
      $gte: transformToTimeStamp(timeRangeQuery, '$gte'),
      $lte: transformToTimeStamp(timeRangeQuery, '$lte')
    };
  };

  this.getStocktakesDates = (fromDate) => {
    let query = {};

    if (fromDate) {
      query.date = TimeRangeQueryBuilder.forInterval(moment(fromDate, 'DD-MM-YY'), moment());
    }

    let stocktakesDates = StocktakeMain.find(query, {sort: {date: -1}})
        .map((item) => HospoHero.dateUtils.formatDate(item.date, 'DD-MM-YY'));

    return _.uniq(stocktakesDates);
  };

  this.report = new ReactiveVar();
  this.searchText = new ReactiveVar();
  this.firstSelectedDate = new ReactiveVar();
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

  this.autorun(() => this.getStockVariance());
});

Template.stockVarianceReport.onRendered(function () {
  this.$('.suppliers-list').select2();
});

Template.stockVarianceReport.helpers({
  stockItems() {
    let stockItems = Template.instance().report.get();
    return stockItems && stockItems.sort((firstItem, secondItem) => secondItem.variance - firstItem.variance);

  },

  emptyStocktake() {
    let stockItems = Template.instance().report.get();
    if (stockItems && stockItems.stocktakes) {
      let emptyStocktake = stockItems.stocktakes.first.elementsCount ? this.secondStocktakeDate : this.firstStocktakeDate;
      return `There's no data to compare. Stocktake by ${emptyStocktake} is empty`;
    }
  },

  tableHeader() {
    return ['Stock Item Name', 'Stocktake Total', 'Orders Received', 'Stocktake Total',
            'Expected COGS', 'Actual COGS', 'Variance'];
  },

  suppliers() {
    return Suppliers.find();
  },

  firstStocktakesDateSelector() {
    let dates = Template.instance().getStocktakesDates();
    return dates.length && dates.shift() && dates;
  },

  secondStocktakesDateSelector() {
    let instance = Template.instance();
    let selectedDate = instance.firstSelectedDate.get();
    return selectedDate ? instance.getStocktakesDates(selectedDate) : [this.secondStocktakeDate];
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
    tmpl.firstSelectedDate.set(firstStocktakeDate);
  },

  'click .change-reports-dates': function (event, tmpl) {
    event.preventDefault();
    let firstStocktakeDate = tmpl.$('.first-stocktake').val();
    let secondStocktakeDate = tmpl.$('.second-stocktake').val();
    tmpl.report.set();

    Router.go('stockVarianceReport', {
      firstStocktakeDate: firstStocktakeDate,
      secondStocktakeDate: secondStocktakeDate
    });
  }
});
