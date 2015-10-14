Meteor.publish("salesPrediction", function() {
    var areaId = HospoHero.getCurrentAreaId(this.userId);
    return SalesPrediction.find({"relations.areaId": areaId});
});

Meteor.publish("importedActualSales", function () {
    var areaId = HospoHero.getCurrentAreaId(this.userId);
    return ImportedActualSales.find({"relations.areaId": areaId});
});