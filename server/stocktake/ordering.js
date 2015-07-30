Meteor.methods({
  'checkReOrdering': function() {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var pipe = [
      {$group: {
        "_id": "$stockId", 
        "mostRecent": {$max: "$date"}
      }}
    ]
    var data = CurrentStocks.aggregate(pipe, {cursor: {batchSize: 0}});
    return data;
  }
});