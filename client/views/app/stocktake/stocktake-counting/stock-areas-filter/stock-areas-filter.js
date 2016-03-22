let stockAreaSortOption = {sort: {createdAt: 1}};
let generalStockAreasQuery = {generalAreaId: {$exists: false}};

Template.stockAreasFilter.onCreated(function () {
  if (!this.data.activeAreas.general) {
    let defaultGeneralArea = StockAreas.findOne(generalStockAreasQuery, stockAreaSortOption);
    if (defaultGeneralArea) {
      this.data.onStockAreaSelect(defaultGeneralArea);
    }
  }
});

Template.stockAreasFilter.helpers({
  generalAreas: function () {
    return StockAreas.find(generalStockAreasQuery, stockAreaSortOption);
  },

  getStockAreaItemContext: Template.stockAreaItem.getStockAreaItemContext
});


Template.stockAreasFilter.events({
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