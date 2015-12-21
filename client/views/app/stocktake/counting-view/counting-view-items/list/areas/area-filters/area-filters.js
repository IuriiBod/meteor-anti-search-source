Template.areaFilters.onRendered(function() {
  var garea = GeneralAreas.findOne({}, {sort: {"createdAt": 1}});
  if (garea && !this.data.generalArea) {
    this.data.stockTakeData.makeGeneralAreaActive(garea._id);
    this.data.stockTakeData.makeSpecialAreaActive(null);
  }
});

Template.areaFilters.helpers({
  generalAreas: function() {
    var main = StocktakeMain.findOne({_id: this.stocktakeId});
    if (main && main.orderReceipts && main.orderReceipts.length > 0) {
      var gareas = main.generalAreas;
      return GeneralAreas.find({"_id": {$in: gareas}}, {sort: {"createdAt": 1}});
    } else {
      return GeneralAreas.find({"active": true}, {sort: {"createdAt": 1}});
    }
  },

  stockTakeData: function() {
    return Template.instance().data.stockTakeData;
  },

  specialAreas: function(gareaId) {
    var main = StocktakeMain.findOne({_id: Template.instance().data.stocktakeId});
    if (main && main.orderReceipts && main.orderReceipts.length > 0) {
      var sareas = main.specialAreas;
      return SpecialAreas.find({"_id": {$in: sareas}, "generalArea": gareaId}, {sort: {"createdAt": 1}});
    } else {
      return SpecialAreas.find({"generalArea": gareaId, "active": true}, {sort: {"name": 1}});
    }
  }
});

Template.areaFilters.events({
  'click .addNewSpecialArea': function (event) {
    event.preventDefault();
    $("#addNewSpecialAreaModal").modal();
  }
});