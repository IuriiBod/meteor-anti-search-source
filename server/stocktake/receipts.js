Meteor.methods({
  generateReceipts: function(version, supplier, info) {
    if(!HospoHero.canUser('edit stocks')()) {
      logger.error("User not permitted to generate receipts");
      throw new Meteor.Error(403, "User not permitted to generate receipts");
    }
    if(!version) {
      logger.error("Stocktake version should have a value");
      throw new Meteor.Error("Stocktake version should have a value");
    }
    var stocktakeMain = StocktakeMain.findOne(version);
    if(!stocktakeMain) {
      logger.error("Stocktake main should exist");
      throw new Meteor.Error("Stocktake main should exist");
    }
    if(!supplier) {
      logger.error("Supplier should exist");
      throw new Meteor.Error("Supplier should exist");
    }
    if(!info.through) {
      logger.error("Order method should exist");
      throw new Meteor.Error("Order method should exist");
    }
    if(!info.deliveryDate) {
      logger.error("Expected delivery date should exist");
      throw new Meteor.Error("Expected delivery date should exist");
    }

    var orderedMethod;
    var ordersExist = StockOrders.findOne({
      "version": version, 
      "supplier": supplier,
      "countOrdered": {$gt: 0}
    });
    if(!ordersExist) {
      logger.error("Orders does not exist");
      throw new Meteor.Error(404, "Orders does not exist");
    }

    var ordersReceiptExist = OrderReceipts.findOne({
      "supplier": supplier,
      "version": version
    });
    if(info.hasOwnProperty("through")) {
      if(info.through == "emailed") {
        //send email to supplier
        if(!info.hasOwnProperty("to")) {
          logger.error("Email address does not exist");
          throw new Meteor.Error(404, "Email address does not exist");
        }
        if(!info.hasOwnProperty("title")) {
          logger.error("Title does not exist");
          throw new Meteor.Error(404, "Title does not exist");
        }
        if(!info.hasOwnProperty("emailText")) {
          logger.error("Email text does not exist");
          throw new Meteor.Error(404, "Email text does not exist");
        }
        Meteor.defer(function() {
          Email.send({
            "to": info.to,
            "from": Meteor.user().emails[0].address,
            "subject": "Order from [Hospo Hero]",
            "html": info.emailText
          });
        });
        logger.info("Email sent to supplier", supplier);
      }
      if(!info.hasOwnProperty("emailText")) {
        logger.error("Email text does not exist");
        throw new Meteor.Error("Email text does not exist");
      }
      Email.send({
        "to": info.to,
        "from": Meteor.user().emails[0].address,
        "subject": "Order from [Hospo Hero]",
        "html": info.emailText
      });
      logger.info("Email sent to supplier", supplier);
    }

    if(ordersReceiptExist) {
      if(ordersReceiptExist.received) {
        logger.error("Order receipt already received");
        throw new Meteor.Error("Order receipt already received");
      } else if(ordersReceiptExist.orderedThrough && ordersReceiptExist.orderedThrough.through) {
        logger.error("Undelivered order exists");
        throw new Meteor.Error("Undelivered order exists");
      } else {
        orderedMethod = {
          "through": info.through,
          "details": info.details
        };
        OrderReceipts.update(
          {"_id": ordersReceiptExist._id}, 
          {$set: {
            "orderedThrough": orderedMethod,
            "orderPlacedBy": Meteor.userId(),
            "expectedDeliveryDate": info.deliveryDate
          }}
        );
        logger.info("Order receipt updated", ordersReceiptExist._id);
      }

    } else {
      orderedMethod = {
        "through": info.through,
        "details": info.details
      };
      //generating order receipt
      var id = OrderReceipts.insert({
        "date": Date.now(),
        "version": version,
        "stocktakeDate": stocktakeMain.stocktakeDate,
        "supplier": supplier,
        "orderedThrough": orderedMethod,
        "orderPlacedBy": Meteor.userId(),
        "expectedDeliveryDate": info.deliveryDate,
        "received": false,
        "receivedDate": null,
        "invoiceFaceValue": 0,
        relations: HospoHero.getRelationsObject()
      });
      logger.info("Order receipt generated", id);
    }   
    //update orders
    StockOrders.update(
      {"version": version, "supplier": supplier},
      {$set: {
        "orderedThrough": orderedMethod, 
        "orderedOn": Date.now(),
        "expectedDeliveryDate": info.deliveryDate,
        "received": false,
        "receivedDate": null,
        "orderReceipt": id
      }},
      {multi: true}
    );
    logger.info("Orders updated", {"stocktakeDate": stocktakeMain.stocktakeDate, "supplier": supplier});
    StocktakeMain.update({"_id": version}, {$addToSet: {"orderReceipts": id}});
  },

  updateReceipt: function(id, info) {
    if(!HospoHero.canUser('edit stocks')()) {
      logger.error("User not permitted to generate receipts");
      throw new Meteor.Error(404, "User not permitted to generate receipts");
    }

    if(OrderReceipts.findOne(id)) {
      var query = {};
      if(info.hasOwnProperty("orderNote")) {
        query['orderNote'] = info.orderNote;
      }
      if(info.hasOwnProperty("expectedDeliveryDate")) {
        query['expectedDeliveryDate'] = info.expectedDeliveryDate;
      }
      if(info.hasOwnProperty("invoiceFaceValue")) {
        query['invoiceFaceValue'] = info.invoiceFaceValue;
      }
      if(info.hasOwnProperty("receiveNote")) {
        query['receiveNote'] = info.receiveNote;
      }
      if(info.hasOwnProperty("invoiceImage")) {
        query['invoiceImage'] = info.invoiceImage;
      }
      if(info.hasOwnProperty("temperature")) {
        query['temperature'] = info.temperature;
      }
      OrderReceipts.update({"_id": id}, {$set: query});
      logger.info("Order receipt updated", id);
    } else {
      if(info.hasOwnProperty("orderNote") || info.hasOwnProperty("expectedDeliveryDate")) {
        if(!info.hasOwnProperty("supplier")) {
          logger.error("Supplier does not exist");
          throw new Meteor.Error(404, "Supplier does not exist");
        }
        if(!info.hasOwnProperty("version")) {
          logger.error("Version does not exist");
          throw new Meteor.Error(404, "Version does not exist");
        }
        if(!info.hasOwnProperty("supplier")) {
          logger.error("Supplier does not exist");
          throw new Meteor.Error(404, "Supplier does not exist");
        }
        var stocktakeMain = StocktakeMain.findOne(info.version);
        if(!stocktakeMain) {
          logger.error("Stocktake main does not exist");
          throw new Meteor.Error(404, "Stocktake main does not exist");
        }
        var doc = {
          "date": Date.now(),
          "version": info.version,
          "stocktakeDate": stocktakeMain.stocktakeDate,
          "supplier": info.supplier,
          "orderedThrough": null,
          "orderPlacedBy": null,
          "expectedDeliveryDate": null,
          "received": false,
          "receivedDate": null,
          "invoiceFaceValue": 0,
          relations: HospoHero.getRelationsObject()
        };
        if(info.hasOwnProperty("orderNote")) {
          doc['orderNote'] = info.orderNote;
        }
        if(info.hasOwnProperty("expectedDeliveryDate")) {
          doc['expectedDeliveryDate'] = info.expectedDeliveryDate;
        }
        var receiptId = OrderReceipts.insert(doc);
        logger.info("New order receipt inserted ", receiptId);
        return receiptId;
      } else {
        logger.error("Receipt does not exist");
        throw new Meteor.Error("Receipt does not exist");
      }
    }
  },

  uploadInvoice: function(id, info) {
    if(!HospoHero.canUser('edit stocks')()) {
      logger.error("User not permitted to generate receipts");
      throw new Meteor.Error(404, "User not permitted to generate receipts");
    }

    HospoHero.checkMongoId(id);

    var receipt = OrderReceipts.findOne(id);
    if(!receipt) {
      logger.error('Receipt not found');
      throw new Meteor.Error("Receipt not found");
    }
    OrderReceipts.update({"_id": id}, {$addToSet: {"invoiceImage": info}});
    logger.info("Invoice uploaded", id);
  }
});