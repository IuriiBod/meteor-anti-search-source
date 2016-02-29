Template.totalValueDetails.onCreated(function () {
  this.stocks = new ReactiveVar();
  this.supplier = new ReactiveVar('All Suppliers');
  this.timer = HospoHero.misc.timer();

  this.getValueDetails = (searchText) => {
    let params = {
      stocktakeMainId: this.data.stocktakeMainId,
      supplierId: this.supplier.get() === 'All Suppliers' ? null : this.supplier.get()._id,
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

Template.totalValueDetails.helpers({
  stocks() {
    return Template.instance().stocks.get();
  },

  suppliers() {
    return Suppliers.find();
  },

  currentSupplier() {
    let supplier = Template.instance().supplier.get();
    return supplier.name || supplier;
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

  'click .supplier': function (event, tmpl) {
    event.preventDefault();

    tmpl.$('.search-stock-items').val('');
    tmpl.supplier.set(this._id ? this : 'All Suppliers');
    tmpl.getValueDetails();
  }
});