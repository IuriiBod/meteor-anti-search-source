Template.totalValueDetails.onCreated(function () {
  this.subscribe('suppliersNamesList', HospoHero.getCurrentAreaId());

  this.stockItems = new ReactiveVar();
  this.supplier = new ReactiveVar(null);

  this.getValueDetails = (currentData, searchText = false) => {
    let stocktakeDate = currentData.params.stocktakeDate;

    let params = {
      stocktakeDate: stocktakeDate,
      supplierId: this.supplier.get(),
      searchText: searchText && searchText.length > 0 ? searchText : null
    };

    Meteor.call('getStocktakeTotalValueDetails', params, HospoHero.handleMethodResult((result) => {
      if (result) {
        this.stockItems.set(result);
      }
    }));
  };

  this.autorun(() => {
    let currentData = Template.currentData();
    this.getValueDetails(currentData);
  });
});


Template.totalValueDetails.helpers({
  onSupplierChanged() {
    let tmpl = Template.instance();
    return function (supplierId) {
      tmpl.supplier.set(supplierId);
      tmpl.$('.search-stock-items').val('');
    };
  },

  stockItems() {
    let stocksList = Template.instance().stockItems.get();
    return stocksList && stocksList.length && stocksList.sort((a, b) => b.stockTotalValue - a.stockTotalValue);
  }
});

Template.totalValueDetails.events({
  'keyup .search-stock-items': _.throttle((event, tmpl) => {
    event.preventDefault();

    let searchText = event.target.value;
    tmpl.getValueDetails(tmpl.data, searchText);
  }, 500, {leading: false}),

  'click .edit-stock-item': function (event) {
    event.preventDefault();

    let ingredientId = this._id;

    FlyoutManager.open('wrapperFlyout', {
      template: 'ingredientEditor',
      title: 'Edit ingredient',
      data: {
        inFlyout: true,
        editMode: true,
        ingredient: ingredientId
      }
    });
  }
});