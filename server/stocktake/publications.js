Meteor.publish("allAreas", function() {
  if(!this.userId) {
    logger.error('User not found');
    this.error(new Meteor.Error(404, "User not found"));
  }

  var query = {};
  var user = Meteor.users.findOne({_id: this.userId});
  if(user.defaultArea) {
    query["relations.areaId"] = user.defaultArea;
  }

  logger.info("All areas published");

  return [
    GeneralAreas.find(query),
    SpecialAreas.find(query)
  ];
});

Meteor.publish("areaSpecificStocks", function(generalArea) {
  logger.info("Ingredients on general area published", generalArea);
  return Ingredients.find({"generalAreas": generalArea});
});

Meteor.publish("areaSpecificStockTakes", function(generalArea) {
  if(!this.userId) {
    logger.error('User not found');
    this.error(new Meteor.Error(404, "User not found"));
  }

  var cursors = [];
  var stocktakes = Stocktakes.find({"generalArea": generalArea});
  cursors.push(stocktakes);
  var ids = [];
  stocktakes.fetch().forEach(function(item) {
    if(ids.indexOf(item._id) < 0) {
      ids.push(item.stockId);
    }
  });
  if(ids.length > 0) {
    cursors.push(Ingredients.find({"_id": {$in: ids}}));
  }
  logger.info("Stocktakes on general area published", generalArea);
  return cursors;
});

Meteor.publish("stocktakeMains", function(date) {
  if(!this.userId) {
    logger.error('User not found');
    this.error(new Meteor.Error(404, "User not found"));
  }

  var query = {
    "stocktakeDate": new Date(date).getTime()
  };
  var user = Meteor.users.findOne({_id: this.userId});
  if(user.defaultArea) {
    query["relations.areaId"] = user.defaultArea;
  }

  logger.info("Stocktake mains published for date", date);
  return StocktakeMain.find(query);
});

Meteor.publish("stocktakes", function(version) {
  if(!this.userId) {
    logger.error('User not found');
    this.error(new Meteor.Error(404, "User not found"));
  }

  var query = {
    $or: [
      { _id: version },
      { "version": version }
    ]
  };
  var user = Meteor.users.findOne({_id: this.userId});
  if(user.defaultArea) {
    query["relations.areaId"] = user.defaultArea;
  }
  logger.info("Stocktakes published for version ", version);
  return Stocktakes.find(query);
});

Meteor.publish("ordersPlaced", function(version) {
  if(!this.userId) {
    logger.error('User not found');
    this.error(new Meteor.Error(404, "User not found"));
  }

  var query = { "version": version };
  var user = Meteor.users.findOne({_id: this.userId});
  if(user.defaultArea) {
    query["relations.areaId"] = user.defaultArea;
  }
  logger.info("Stock orders published for version ", version);
  return StockOrders.find(query);
});

Meteor.publish("orderReceipts", function(ids) {
  logger.info("Stock order receipts published ", ids);
  return OrderReceipts.find({"_id": {$in: ids}});
});

Meteor.publish("orderReceiptsByVersion", function(version) {
  if(!this.userId) {
    logger.error('User not found');
    this.error(new Meteor.Error(404, "User not found"));
  }

  var query = { "version": version };
  var user = Meteor.users.findOne({_id: this.userId});
  if(user.defaultArea) {
    query["relations.areaId"] = user.defaultArea;
  }

  logger.info("Stock order receipts published by version", version);
  return OrderReceipts.find(query);
});

Meteor.publish("allOrderReceipts", function() {
  if(!this.userId) {
    logger.error('User not found');
    this.error(new Meteor.Error(404, "User not found"));
  }

  var query = {};
  var user = Meteor.users.findOne({_id: this.userId});
  if(user.defaultArea) {
    query["relations.areaId"] = user.defaultArea;
  }

  logger.info("Stock order receipts published");
  return OrderReceipts.find(query, {sort: {"date": -1}, limit: 10});
});

Meteor.publish("receiptOrders", function(receiptId) {
  if(!this.userId) {
    logger.error('User not found');
    this.error(new Meteor.Error(404, "User not found"));
  }

  var query = { "orderReceipt": receiptId };
  var user = Meteor.users.findOne({_id: this.userId});
  if(user.defaultArea) {
    query["relations.areaId"] = user.defaultArea;
  }

  logger.info("Stock orders published for receipt ", receiptId);
  return StockOrders.find(query);
});


Meteor.publish("currentStocks", function(ids) {
  logger.info("Current stocks published ", ids);
  return CurrentStocks.find({"_id": {$in: ids}});
});
