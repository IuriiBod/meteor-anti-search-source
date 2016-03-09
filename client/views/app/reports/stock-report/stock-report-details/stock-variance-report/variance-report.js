Template.stockVarianceReport.onCreated(function () {
  this.report = new ReactiveVar();
  this.supplier = new ReactiveVar('All Suppliers');
  let makeTimeStampQueryFromDate = (date) => {
    let transformToTimeStamp = (object, key) => new Date(object[key]).getTime();
    let timeRangeQuery = TimeRangeQueryBuilder.forDay(moment(date, 'DD-MM-YY'));

    return {
      $gte: transformToTimeStamp(timeRangeQuery, '$gte'),
      $lte: transformToTimeStamp(timeRangeQuery, '$lte')
    }
  };

  this.getStockVariance = (searchText) => {
    let params = {
      firstStocktakeDate: makeTimeStampQueryFromDate(this.data.firstStocktakeDate),
      secondStocktakeDate: makeTimeStampQueryFromDate(this.data.secondStocktakeDate),
      supplierId: this.supplier.get() === 'All Suppliers' ? null : this.supplier.get(),
      searchText: searchText && searchText.length ? searchText : null
    };

    Meteor.call('getStockVarianceReport', params, HospoHero.handleMethodResult((result) => {
      if (result) {
        this.report.set(result);
      }
    }));
  };

  this.getStockVariance();
});

Template.stockVarianceReport.onRendered(function () {
  this.$('.suppliers-list').select2();
  var datePicker = this.$('#datepicker');

  datePicker.datepicker({
    format: 'yyyy-mm-dd'
  });
});

Template.stockVarianceReport.helpers({
  stockItems() {
    let stockItems = Template.instance().report.get();
    return stockItems && stockItems.sort((firstItem, secondItem) => secondItem.variance - firstItem.variance);
  },

  tableHeader() {
    return ['Stock Item Name', 'Stocktake Total', 'Orders Received', 'Stocktake Total',
            'Expected COGS', 'Actual COGS', 'Variance']
  },

  suppliers() {
    return Suppliers.find();
  }
});

Template.stockVarianceReport.events({
  'keyup .search-stock-items': _.throttle(function (event, tmpl) {
    event.preventDefault();

    let searchText = event.target.value;
    tmpl.getStockVariance(searchText);

  }, 500, {leading: false}),

  'change .suppliers-list': function (event, tmpl) {
    event.preventDefault();
    let supplierId = event.target.value;

    tmpl.$('.search-stock-items').val('');
    tmpl.supplier.set(supplierId);
    tmpl.getStockVariance();
  }
});