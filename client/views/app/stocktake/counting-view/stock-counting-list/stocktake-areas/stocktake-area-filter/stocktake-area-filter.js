Template.stocktakeAreaFilter.onCreated(function() {
  this.mainStocktake = StocktakeMain.findOne({_id: this.data.stocktakeId});
});

Template.stocktakeAreaFilter.onRendered(function() {
  var garea = GeneralAreas.findOne({}, {sort: {"createdAt": 1}});
  if (garea && !this.data.stockTakeData.activeGeneralArea) {
    this.data.stockTakeData.makeGeneralAreaActive(garea._id);
    this.data.stockTakeData.makeSpecialAreaActive(null);
  }
});

Template.stocktakeAreaFilter.helpers({
  generalAreas: function() {
    var main = Template.instance().mainStocktake;
    if (main && main.orderReceipts && main.orderReceipts.length > 0) {
      var gareas = main.generalAreas;
      return GeneralAreas.find({"_id": {$in: gareas}}, {sort: {"createdAt": 1}});
    } else {
      return GeneralAreas.find({"active": true}, {sort: {"createdAt": 1}});
    }
  },

  activeGeneralArea: function(id) {
    return Template.parentData().stockTakeData.activeGeneralArea === id;
  },

  specialAreas: function(gareaId) {
    var main = Template.instance().mainStocktake;
    if (main && main.orderReceipts && main.orderReceipts.length > 0) {
      var sareas = main.specialAreas;
      return SpecialAreas.find({"_id": {$in: sareas}, "generalArea": gareaId}, {sort: {"createdAt": 1}});
    } else {
      return SpecialAreas.find({"generalArea": gareaId, "active": true}, {sort: {"name": 1}});
    }
  }
});

Template.stocktakeAreaFilter.events({
  'click .addNewSpecialArea': function (event) {
    event.preventDefault();
    $("#addNewSpecialAreaModal").modal();
  }
});