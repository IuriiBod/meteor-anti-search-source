Meteor.methods({
  stockTakeHistory: function () {
    if (!HospoHero.canUser('edit stocks', Meteor.userId())) {
      logger.error("User not permitted to view stock take history");
      throw new Meteor.Error(403, "User not permitted to view stock take history");
    }
    var pipe = [{
      $match: {
        "relations.areaId": HospoHero.getCurrentAreaId()
      }
    }, {
      $group: {
        _id: "$version",
        date: {$first: "$date"},
        totalStockValue: {$sum: {$multiply: ["$counting", "$unitCost"]}}
      }
    }, {
      $sort: {"date": 1}
    }, {
      $limit: 20
    }];
    var data = Stocktakes.aggregate(pipe, {cursor: {batchSize: 0}});
    logger.info("Stocktake history published");
    return data;
  }
});