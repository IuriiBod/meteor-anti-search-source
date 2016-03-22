let canUserReceiveDeliveries = function (areaId = null) {
  var checker = new HospoHero.security.PermissionChecker();
  return checker.hasPermissionInArea(areaId, 'receive deliveries');
};


let getAreaIdFromOrder = function (orderId) {
  var order = OrderItems.findOne({_id: orderId});
  return (order && order.relations) ? order.relations.areaId : null;
};

Meteor.methods({
  generateOrders: function (stocktakeId) {
    check(stocktakeId, HospoHero.checkers.StocktakeId);

    let stocktake = Stocktakes.findOne({_id: stocktakeId});

    if (!stocktake || !canUserReceiveDeliveries(stocktake.relations.areaId)) {
      logger.error("User not permitted to generate orders");
      throw new Meteor.Error(403, "User not permitted to generate orders");
    }

    let ordersGenerator = new HospoHero.stocktake.OrdersGenerator(stocktake);
    ordersGenerator.generate();
  },

  updateOrder: function (updatedOrder) {
    check(updatedOrder, HospoHero.checkers.OrderDocument);

    let orderId = updatedOrder._id;
    delete updatedOrder._id;

    if (!canUserReceiveDeliveries(getAreaIdFromOrder(id))) {
      logger.error("User not permitted to generate receipts");
      throw new Meteor.Error(404, "User not permitted to generate receipts");
    }

    Orders.update({_id: orderId}, {$set: updatedOrder});
  },

  editOrderingCount: function (stockItemId, count) {
    check(stockItemId, HospoHero.checkers.StockItemId);
    check(count, Number);

    let stockItem = StockItems.findOne({_id: stockItemId});
    if (!stockItem || !canUserReceiveDeliveries(stockItem.relations.areaId)) {
      logger.error("User not permitted to edit ordering count");
      throw new Meteor.Error(404, "User not permitted to edit ordering count");
    }

    count = _.isFinite(count) ? count : 0;
    StockItems.update({_id: stockItemId}, {$set: {'orderItem.orderedCount': count}});
  },


  /*** receipts ***/
  //todo:stocktake refactor it
  generateReceipts: function (stocktakeId, supplierId, info) {
    if (!canUserReceiveDeliveries()) {
      logger.error("User not permitted to generate receipts");
      throw new Meteor.Error(403, "User not permitted to generate receipts");
    }
    if (!stocktakeId) {
      logger.error("Stocktake version should have a value");
      throw new Meteor.Error("Stocktake version should have a value");
    }
    var stocktakeMain = Stocktakes.findOne({_id: stocktakeId});
    if (!stocktakeMain) {
      logger.error("Stocktake main should exist");
      throw new Meteor.Error("Stocktake main should exist");
    }
    if (!supplierId) {
      logger.error("Supplier should exist");
      throw new Meteor.Error("Supplier should exist");
    }
    if (!info.through) {
      logger.error("Order method should exist");
      throw new Meteor.Error("Order method should exist");
    }
    if (!info.expectedDeliveryDate) {
      logger.error("Expected delivery date should exist");
      throw new Meteor.Error("Expected delivery date should exist");
    }

    var orderedMethod;
    var ordersExist = OrderItems.findOne({
      version: stocktakeId,
      supplier: supplierId,
      countOrdered: {$gt: 0}
    });
    if (!ordersExist) {
      logger.error("Orders does not exist");
      throw new Meteor.Error(404, "Orders does not exist");
    }

    if (info.hasOwnProperty("through")) {
      if (info.through === "emailed") {
        //send email to supplier
        if (!info.hasOwnProperty("to")) {
          logger.error("Email address does not exist");
          throw new Meteor.Error(404, "Email address does not exist");
        }
        if (!info.hasOwnProperty("title")) {
          logger.error("Title does not exist");
          throw new Meteor.Error(404, "Title does not exist");
        }
        if (!info.hasOwnProperty("emailText")) {
          logger.error("Email text does not exist");
          throw new Meteor.Error(404, "Email text does not exist");
        }

        Email.send({
          to: info.to,
          from: Meteor.user().emails[0].address,
          subject: info.title,
          html: info.emailText
        });
        logger.info("Email sent to supplier", supplierId);
      }
    }

    var existingOrderReceipt = Orders.findOne({
      supplier: supplierId,
      version: stocktakeId
    });

    var orderReceiptId = existingOrderReceipt && existingOrderReceipt._id;
    if (existingOrderReceipt) {
      if (existingOrderReceipt.received) {
        logger.error("Order receipt already received");
        throw new Meteor.Error("Order receipt already received");
      } else if (existingOrderReceipt.orderedThrough && existingOrderReceipt.orderedThrough.through) {
        logger.error("Undelivered order exists");
        throw new Meteor.Error("Undelivered order exists");
      } else {
        orderedMethod = {
          through: info.through,
          details: info.details
        };
        Orders.update({
          _id: existingOrderReceipt._id
        }, {
          $set: {
            orderedThrough: orderedMethod,
            orderPlacedBy: Meteor.userId(),
            expectedDeliveryDate: info.expectedDeliveryDate
          }
        });
        logger.info("Order receipt updated", existingOrderReceipt._id);
      }
    } else {
      orderedMethod = {
        through: info.through,
        details: info.details
      };
      //generating order receipt
      orderReceiptId = Orders.insert({
        date: new Date(),
        version: stocktakeId,
        stocktakeDate: stocktakeMain.stocktakeDate,
        supplier: supplierId,
        orderedThrough: orderedMethod,
        orderPlacedBy: Meteor.userId(),
        expectedDeliveryDate: info.expectedDeliveryDate,
        received: false,
        receivedDate: null,
        invoiceFaceValue: 0,
        relations: HospoHero.getRelationsObject()
      });
      logger.info("Order receipt generated", orderReceiptId);
    }
    //update orders
    OrderItems.update({
      version: stocktakeId,
      supplier: supplierId
    }, {
      $set: {
        orderedThrough: orderedMethod,
        orderedOn: new Date(),
        expectedDeliveryDate: info.expectedDeliveryDate,
        received: false,
        receivedDate: null,
        orderReceipt: orderReceiptId
      }
    }, {
      multi: true
    });

    logger.info("Orders updated", {stocktakeDate: stocktakeMain.stocktakeDate, supplier: supplierId});
    Stocktakes.update({_id: stocktakeId}, {$addToSet: {orderReceipts: orderReceiptId}});
  }
});


/*** receive delivery ***/

var getAreaIdFromReceipt = function (receiptId) {
  var receipt = OrderItems.findOne({_id: receiptId});
  return (receipt && receipt.relations) ? receipt.relations.areaId : null;
};

Meteor.methods({
  receiveDelivery: function (receiptId) {
    if (!canUserReceiveDeliveries(getAreaIdFromReceipt(receiptId))) {
      logger.error("User not permitted to receive delivery");
      throw new Meteor.Error(403, "User not permitted to receive delivery");
    }
    if (!receiptId) {
      logger.error("Receipt id not found");
      throw new Meteor.Error(401, "Receipt id not found");
    }

    if (!Orders.findOne(receiptId)) {
      logger.error("Receipt  not found");
      throw new Meteor.Error("Receipt  not found");
    }
    Orders.update(
      {_id: receiptId},
      {
        $set: {
          received: true,
          receivedDate: Date.now(),
          receivedBy: Meteor.userId()
        }
      }
    );
    logger.info("Order receipt marked as received", receiptId);
  },

  updateOrderItems: function (id, receiptId, status, info) {
    if (!canUserReceiveDeliveries(getAreaIdFromOrder(id))) {
      logger.error("User not permitted to update oreder items");
      throw new Meteor.Error(403, "User not permitted to update oreder items");
    }
    if (!id) {
      logger.error("Id not found");
      throw new Meteor.Error(401, "Id not found");
    }
    if (!receiptId) {
      logger.error("Receipt id not found");
      throw new Meteor.Error(401, "Receipt id not found");
    }
    if (!status) {
      logger.error("Status not found");
      throw new Meteor.Error(401, "Status not found");
    }
    var order = OrderItems.findOne(id);
    if (!order) {
      logger.error("Order not found");
      throw new Meteor.Error(401, "Order not found");
    }

    var query = {};
    var setQuery = {};

    if (status === "Wrong Price") {
      if (!info.price) {
        logger.error("Price not found");
        throw new Meteor.Error(401, "Price not found");
      }
      setQuery.unitPrice = info.price;
      if (!order.originalPrice) {
        setQuery.originalPrice = order.unitPrice;
      }
      setQuery.priceUpdatedBy = Meteor.userId();
      setQuery.stockPriceUpdated = info.stockPriceUpdated;
    } else if (status === "Wrong Quantity") {
      if (info.quantity < 0) {
        logger.error("Quantity not found");
        throw new Meteor.Error(401, "Quantity not found");
      }
      setQuery.countDelivered = info.quantity;
      setQuery.countDeliveredUpdatedBy = Meteor.userId();
    }
    if (Object.keys(setQuery).length > 0) {
      query.$set = setQuery;
    }

    OrderItems.update({_id: id, orderReceipt: receiptId}, query);

    order = OrderItems.findOne(id);
    var newStatus = [];
    if (order.unitPrice === order.originalPrice && order.countDelivered === order.countOrdered) {
      newStatus.push('Delivered Correctly');
    } else {
      if (order.unitPrice !== order.originalPrice) {
        newStatus.push('Wrong Price');
      }
      if (order.countDelivered !== order.countOrdered) {
        newStatus.push('Wrong Quantity');
      }
    }
    OrderItems.update({_id: id, orderReceipt: receiptId}, {
      $set: {deliveryStatus: newStatus}
    });

    logger.info("Stock order updated", id, status);
  },

  receiveOrderItems: function (id, receiptId, info) {
    if (!canUserReceiveDeliveries(getAreaIdFromOrder(id))) {
      logger.error("User not permitted to receive oreder items");
      throw new Meteor.Error(403, "User not permitted to receive oreder items");
    }
    if (!id) {
      logger.error("Id not found");
      throw new Meteor.Error(401, "Id not found");
    }
    if (!receiptId) {
      logger.error("Receipt id not found");
      throw new Meteor.Error(401, "Receipt id not found");
    }
    var order = OrderItems.findOne(id);
    if (!order) {
      logger.error("Order not found");
      throw new Meteor.Error(401, "Order not found");
    }
    var updateQuery = {
      received: info.received,
      receivedBy: Meteor.userId(),
      receivedDate: Date.now()
    };
    if (!order.deliveryStatus || order.deliveyStatus.length < 0) {
      _.extend(updateQuery, {
        deliveryStatus: ['Delivered Correctly'],
        receivedBy: Meteor.userId(),
        receivedDate: Date.now()
      });
    }

    OrderItems.update(
      {_id: id, orderReceipt: receiptId},
      {$set: updateQuery}
    );
    logger.info("Stock order received", id);
  }
});