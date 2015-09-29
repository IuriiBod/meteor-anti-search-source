Meteor.methods({
  'stockTakeHistory': function () {
    if (!HospoHero.perms.canEditStock()) {
      logger.error("User not permitted to view stocktake");
      throw new Meteor.Error(403, "User not permitted to view stocktake");
    }
    var pipe = [
      {
        $match: {
          "relations.areaId": HospoHero.getDefaultArea()
        }
      },
      {
        $group: {
          _id: "$version",
          date: {$first: "$date"},
          totalStockValue: {
            $sum: {
              $multiply: ["$counting", "$unitCost"]
            }
          }
        }
      },
      {
        $sort: {
          date: -1
        }
      },
      {$limit: 20}
    ];

    var data = Stocktakes.aggregate(pipe, {cursor: {batchSize: 0}});
    logger.info("Stocktake history published");
    return data;
  }
});