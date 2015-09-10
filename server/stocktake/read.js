Meteor.methods({
  'stockTakeHistory': function() {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var permitted = isManagerOrAdmin(user);
    if(!permitted) {
      logger.error("User not permitted to create ingredients");
      throw new Meteor.Error(403, "User not permitted to create ingredients");
    }
    var pipe = [
      {$group: {
          _id: "$version",
          date: {$first: "$date"},
          totalStockValue: {$sum: {$multiply: ["$counting", "$unitCost"]}},
        }
      },
      {$sort: {"date": -1}},
      {$limit: 20}
    ]
    var data = Stocktakes.aggregate(pipe, {cursor: {batchSize: 0}});
    logger.info("Stocktake history published");
    return data;
  }
});