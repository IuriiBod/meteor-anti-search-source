let stockAreaSortOption = {sort: {createdAt: 1}};
let generalStockAreasQuery = {generalAreaId: {$exists: false}, active: true};

Template.stocktakeAreaFilter.onCreated(function () {
  if (!this.data.activeAreas.general) {
    let defaultGeneralArea = StockAreas.findOne(generalStockAreasQuery, stockAreaSortOption);
    if (defaultGeneralArea) {
      this.data.onStockAreaSelect(defaultGeneralArea);
    }
  }
});

Template.stocktakeAreaFilter.helpers({
  generalAreas: function () {
    return StockAreas.find(generalStockAreasQuery, stockAreaSortOption);
  },

  getStockAreaItemContext: Template.stockAreaItem.getStockAreaItemContext
});


Template.stocktakeAreaFilter.events({
  'click .add-general-area-button': function (event) {
    event.preventDefault();

    sweetAlert({
      title: "Add new general area",
      text: "General area name",
      type: "input",
      showCancelButton: true,
      closeOnConfirm: true,
      animation: "slide-from-top",
      inputPlaceholder: "area name"
    }, function (generalAreaName) {
      if (!generalAreaName) {
        HospoHero.error("Area name is required!");
        return;
      }

      Meteor.call('createGeneralArea', generalAreaName, HospoHero.handleMethodResult());
    });
  }
});