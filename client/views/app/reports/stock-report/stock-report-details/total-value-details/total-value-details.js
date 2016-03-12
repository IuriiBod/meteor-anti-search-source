Template.totalValueDetails.onCreated(function () {
  this.stocks = new ReactiveVar();
  this.supplier = new ReactiveVar('All Suppliers');

  this.getValueDetails = (searchText) => {
    let params = {
      stocktakeMainId: this.data.stocktakeMainId,
      supplierId: this.supplier.get() === 'All Suppliers' ? null : this.supplier.get(),
      searchText: searchText && searchText.length ? searchText : null
    };
    Meteor.call('getStocktakeTotalValueDetails', params, HospoHero.handleMethodResult((result) => {
      if (result) {
        this.stocks.set(result);
      }
    }));
  };

  this.getValueDetails();
});

Template.totalValueDetails.onRendered(function () {
  this.$('.suppliers-list').select2();
});

Template.totalValueDetails.helpers({
  stocks() {
    let stocksList = Template.instance().stocks.get();
    return stocksList && stocksList.length && stocksList.sort((a, b) => b.stockTotalValue - a.stockTotalValue);
  },

  suppliers() {
    return Suppliers.find();
  }
});

Template.totalValueDetails.events({
  'keyup .search-stock-items': _.throttle(function (event, tmpl) {
    event.preventDefault();

    let searchText = event.target.value;
    tmpl.getValueDetails(searchText);
  }, 500, {leading: false}),

  'change .suppliers-list': function (event, tmpl) {
    event.preventDefault();
    let supplierId = event.target.value;

    tmpl.$('.search-stock-items').val('');
    tmpl.supplier.set(supplierId);
    tmpl.getValueDetails();
  }
});