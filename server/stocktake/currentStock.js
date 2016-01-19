var rawColl = CurrentStocks.rawCollection();

Meteor.methods({
  updateCurrentStock: function (stockId, note, quantity, date) {
    if (!HospoHero.canUser('receive deliveries', Meteor.userId())) {
      logger.error("User not permitted to edit current stock");
      throw new Meteor.Error(403, "User not permitted to edit current stock");
    }
    var query = {"stockId": stockId};
    var sort = {"version": -1};
    var count = parseFloat(quantity) ? parseFloat(quantity) : 0;
    var update = {
      $inc: {"count": count, "version": 1},
      $set: {"date": new Date(date), "note": note, relations: HospoHero.getRelationsObject()}
    };
    var options = {
      upsert: true,
      new: false
    };
    rawColl.findAndModify = Meteor.wrapAsync(rawColl.findAndModify, rawColl);
    var oldDoc = rawColl.findAndModify(query, sort, update, options);
    if (oldDoc && oldDoc.count > 0) {
      delete oldDoc._id;
      CurrentStocks.insert(oldDoc);
    }
    logger.info("Current stock updated", {"stockId": stockId});
  },

  resetCurrentStock: function (stockId, note, quantity, date) {
    if (!HospoHero.canUser('receive deliveries', Meteor.userId())) {
      logger.error("User not permitted to reset current stock");
      throw new Meteor.Error(403, "User not permitted to reset current stock");
    }
    var latest = CurrentStocks.find({"stockId": stockId}, {sort: {"version": -1}}).fetch();
    var count = parseFloat(quantity) ? parseFloat(quantity) : 0;
    var doc = {
      "stockId": stockId,
      "count": count,
      "note": note,
      "date": new Date(date),
      relations: HospoHero.getRelationsObject()
    };
    if (latest && latest.length > 0) {
      var old = latest[0];
      if (old) {
        doc['version'] = (old.version + 1);
      }
    } else {
      doc['version'] = 1;
    }
    var id = CurrentStocks.insert(doc);
    logger.info("New current stock entry added", {"_id": id, "stockId": stockId});
  },
});