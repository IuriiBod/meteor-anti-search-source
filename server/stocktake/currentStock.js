rawColl = CurrentStocks.rawCollection();

Meteor.methods({
  updateCurrentStock: function(stockId, note, quantity, date) {
    var query = {"stockId": stockId};
    var sort = {"version": -1};
    var count = parseFloat(quantity);
    if(count != count) {
      count = 0;
    }
    var update = {$inc: {"count": count, "version": 1}, $set: {"date": new Date(date), "note": note}};
    var options = {
      upsert: true,
      new: false
    };

    rawColl.findAndModify = Meteor.wrapAsync(rawColl.findAndModify, rawColl);
    var oldDoc = rawColl.findAndModify(query, sort, update, options);
    if(oldDoc && oldDoc.count > 0) {
      delete oldDoc._id;
      CurrentStocks.insert(oldDoc);
    }
  },

  resetCurrentStock: function(stockId, note, quantity, date) {
    var query = {"stockId": stockId};
    var latest = CurrentStocks.find({"stockId": stockId}, {sort: {"version": -1}}).fetch();
    var count = parseFloat(quantity);
    if(count != count) {
      count = 0;
    }
    var doc = {
      "stockId": stockId,
      "count": count,
      "note": note,
      "date": new Date(date)
    }
    if(latest && latest.length > 0) {
      var old = latest[0];
      if(old) {
        doc['version'] = (old.version + 1);
      }
    } else {
      doc['version'] = 1;
    }
    var id = CurrentStocks.insert(doc);
    logger.info("New current stock entry added",{"_id": id, "stockId": stockId});
    return;
  },

  readDaily: function(start, end) {
    var pipe = [
      {$match: {"date": {$gte: new Date(start), $lte: new Date(end)}}},
      {$sort: {version: -1}},
      {$group: {
          _id : {stockId: "$stockId", date: "$date"},
          count: {$first: "$count"}
        }
      }
    ]
    var data = CurrentStocks.aggregate(pipe, {cursor: {batchSize: 0}});
    logger.info("Current stock published");
    return data;
  }

});