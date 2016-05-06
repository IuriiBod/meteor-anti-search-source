//context: firstStocktakeDate (Date), secondStocktakeDate (Date)

Template.stockVarianceReport.onCreated(function () {
  this.report = new ReactiveVar(false);
  this.searchText = new ReactiveVar();

  this.supplierId = new ReactiveVar(null);

  this.getStockVariance = () => {
    let currentData = Template.currentData();
    let searchText = this.searchText.get();

    let params = {
      firstStocktakeDate: currentData.firstStocktakeDate,
      secondStocktakeDate: currentData.secondStocktakeDate,
      supplierId: this.supplierId.get(),
      searchText: searchText && searchText.length > 0 ? searchText : null
    };

    Meteor.call('getStockVarianceReport', params, HospoHero.handleMethodResult((result) => {
      if (result) {
        this.report.set(result);
      }
    }));
  };

  this.autorun(() => this.getStockVariance());
});


Template.stockVarianceReport.helpers({
  stockItems() {
    let stockItems = Template.instance().report.get();
    return stockItems && stockItems.sort((firstItem, secondItem) => secondItem.variance - firstItem.variance);
  },

  emptyStocktake() {
    let stockItems = Template.instance().report.get();
    if (stockItems && stockItems.stocktakes) {
      let stocktakeDate = stockItems.stocktakes.first.elementsCount ? this.secondStocktakeDate : this.firstStocktakeDate;
      return moment(stocktakeDate).format('DD-MM-YY');
    }
  },

  tableHeader() {
    return ['Stock Item Name', 'Stocktake Total', 'Orders Received', 'Stocktake Total',
      'Expected COGS', 'Actual COGS', 'Variance'];
  },

  onStocktakeIntervalSubmit() {
    let tmpl = Template.instance();

    return function (firstDate, secondDate, event) {
      const formatStocktakeDate = (date) => moment(date).format('DD-MM-YY');
      tmpl.report.set(false);

      Router.go('stockVarianceReport', {
        firstStocktakeDate: formatStocktakeDate(firstDate),
        secondStocktakeDate: formatStocktakeDate(secondDate)
      });

      //hide loading animation of submit button (see waitButton component)
      Template.waitButton.handleMethodResult(event)();
    };
  },

  onSupplierIdChanged(){
    let tmpl = Template.instance();

    return function (supplierId) {
      tmpl.supplierId.set(supplierId);
      tmpl.searchText.set(null);
      tmpl.$('.search-stock-items').val('');
    };
  }
});


Template.stockVarianceReport.events({
  'keyup .search-stock-items': _.throttle(function (event, tmpl) {
    event.preventDefault();

    let searchText = event.target.value;
    tmpl.searchText.set(searchText);
  }, 500, {leading: false}),

  'click .edit-stock-item': function (event) {
    event.preventDefault();
    let ingredientId = this._id;

    FlyoutManager.open('ingredientEditor', {
      title: 'Edit ingredient',
      editMode: true,
      ingredientId: ingredientId
    });
  }
});


