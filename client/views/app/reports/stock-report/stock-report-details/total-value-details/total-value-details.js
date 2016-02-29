Template.totalValueDetails.onCreated(function () {
  this.stocks = new ReactiveVar();
  this.supplier = new ReactiveVar('All Suppliers');
  this.timer = HospoHero.misc.timer();

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
    return stocksList.length && stocksList.sort((a, b) => b.stockTotalValue - a.stockTotalValue);
  },

  suppliers() {
    return Suppliers.find();
  }
});

Template.totalValueDetails.events({
  'keyup .search-stock-items': function (event, tmpl) {
    event.preventDefault();

    let searchText = event.target.value;
    let callFunc = () => tmpl.getValueDetails(searchText);

    tmpl.timer.clearTimeout();
    tmpl.timer.setTimeout(callFunc, 300);
  },

  'change .suppliers-list': function (event, tmpl) {
    event.preventDefault();
    let supplierId = event.target.value;

    tmpl.$('.search-stock-items').val('');
    tmpl.supplier.set(supplierId);
    tmpl.getValueDetails();
  }
});