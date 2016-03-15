let stockAreaSortOption = {sort: {createdAt: 1}};
let generalStockAreasQuery = {generalAreaId: {$exists: false}};

Template.stocktakeAreaFilter.onCreated(function () {
  this.mainStocktake = StocktakeMain.findOne({_id: this.data.stocktakeId});
});


Template.stocktakeAreaFilter.onRendered(function () {
  var generalArea = StockAreas.findOne(generalStockAreasQuery, stockAreaSortOption);

  if (generalArea && !this.data.stockTakeData.activeGeneralArea) {
    this.data.stockTakeData.makeGeneralAreaActive(generalArea._id);
    this.data.stockTakeData.makeSpecialAreaActive(null);
  }
});


Template.stocktakeAreaFilter.helpers({
  generalAreas: function () {
    let query = _.extend({active: true}, generalStockAreasQuery);
    return StockAreas.find(query, stockAreaSortOption);
  },

  activeGeneralArea: function (id) {
    return Template.parentData().stockTakeData.activeGeneralArea === id;
  },

  specialAreas: function (generalAreaId) {
    return StockAreas.find({generalAreaId: generalAreaId, active: true}, {sort: {name: 1}});
  }
});


Template.stocktakeAreaFilter.events({
  'click .addNewSpecialArea': function (event) {
    event.preventDefault();
    $("#addNewSpecialAreaModal").modal();
  }
});