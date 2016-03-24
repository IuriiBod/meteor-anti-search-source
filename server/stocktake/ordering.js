let canUserReceiveDeliveries = function (areaId = null) {
  var checker = new HospoHero.security.PermissionChecker();
  return checker.hasPermissionInArea(areaId, 'receive deliveries');
};


let getAreaIdFromOrder = function (orderId) {
  var order = OrderItems.findOne({_id: orderId});
  return (order && order.relations) ? order.relations.areaId : null;
};

//this method is used as temporal cap for email ordering
//in future user should be able to change this date inside send email modal
let getExpectedDeliveryLocalMoment = function (order) {
  let locationId = order.relations.locationId;
  let defaultDeliveryDate = moment().add(1, 'day');
  return HospoHero.dateUtils.getDateMomentForLocation(defaultDeliveryDate, locationId).startOf('day');
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

    if (!canUserReceiveDeliveries(getAreaIdFromOrder(orderId))) {
      logger.error("User not permitted to update orders");
      throw new Meteor.Error(404, "User not permitted to update orders");
    }

    Orders.update({_id: orderId}, {$set: updatedOrder});
  },

  updateOrderItem: function (updatedOrderItem) {
    check(updatedOrderItem, HospoHero.checkers.OrderItemDocument);

    let oldOrderItem = OrderItems.findOne({_id: updatedOrderItem._id});
    if (!oldOrderItem || !canUserReceiveDeliveries(oldOrderItem.relations.areaId)) {
      logger.error("User not permitted to edit order items");
      throw new Meteor.Error(404, "You are not permitted to edit order items");
    }

    delete updatedOrderItem._id;
    OrderItems.update({_id: oldOrderItem._id}, {$set: updatedOrderItem});
  },

  removeOrderItem: function (orderItemId) {
    check(orderItemId, HospoHero.checkers.OrderItemId);

    let orderItem = OrderItems.findOne({_id: orderItemId});
    if (!orderItem || !canUserReceiveDeliveries(orderItem.relations.areaId)) {
      logger.error("User not permitted to edit orders");
      throw new Meteor.Error(404, "User not permitted to edit orders");
    }

    OrderItems.remove({_id: orderItemId});
  },

  renderOrderTemplate: function (orderId) {
    check(orderId, HospoHero.checkers.OrderId);

    let order = Orders.findOne({_id: orderId});
    if (!order || !canUserReceiveDeliveries(order.relations.areaId)) {
      logger.error("User not permitted to send orders");
      throw new Meteor.Error(404, "You are not permitted to send orders");
    }

    let total = 0;
    let convertStockOrder = function (orderItem) {
      let ingredient = Ingredients.findOne({
        _id: orderItem.ingredient.id
      }, {fields: {code: 1, description: 1, portionOrdered: 1}});

      let cost = orderItem.orderedCount * orderItem.ingredient.cost;
      orderItem.cost = cost.toFixed(2);
      total += cost;

      _.extend(orderItem.ingredient, {
        description: ingredient.description,
        code: ingredient.code,
        portionOrdered: ingredient.portionOrdered
      });

      return orderItem;
    };

    let orderItemsData = OrderItems.find({
      orderId: orderId,
      orderedCount: {$gt: 0}
    }, {
      fields: {
        orderedCount: 1,
        ingredient: 1
      }
    }).map(convertStockOrder);

    let area = HospoHero.getCurrentArea(this.userId);
    let location = Locations.findOne({_id: area.locationId});

    let user = {
      name: HospoHero.username(this.userId),
      type: HospoHero.roles.getUserRoleName(this.userId, HospoHero.getCurrentAreaId(this.userId))
    };


    let supplier = Suppliers.findOne({_id: order.supplierId}, {fields: {name: 1}});

    let orderData = {
      supplierName: supplier.name,
      deliveryDate: getExpectedDeliveryLocalMoment(order).format('ddd DD/MM/YYYY'),
      orderNote: order && order.orderNote || '',
      location: location,
      areaName: area.name,
      orderData: orderItemsData,
      total: total.toFixed(2),
      user: user
    };

    return Handlebars.templates['supplier-email-text'](orderData);
  },

  orderThroughEmail: function (orderId, mailInfo) {
    check(orderId, HospoHero.checkers.OrderId);
    check(mailInfo, {
      mailTo: HospoHero.checkers.Email,
      subject: String,
      text: String
    });

    let order = Orders.findOne({_id: orderId});
    if (!order || !canUserReceiveDeliveries(order.relations.areaId)) {
      logger.error("User not permitted to send orders");
      throw new Meteor.Error(404, "You are not permitted to send orders");
    }

    //send order to supplier
    Email.send({
      to: mailInfo.mailTo,
      from: Meteor.user().emails[0].address,
      subject: mailInfo.subject,
      html: mailInfo.text
    });
    logger.info("Email sent to supplier", {orderId: orderId});

    //mark order as ordered through email
    Orders.update({_id: orderId}, {
      $set: {
        expectedDeliveryDate: getExpectedDeliveryLocalMoment(order).toDate(),
        orderedThrough: {
          date: new Date(),
          type: 'emailed',
          email: mailInfo.mailTo
        }
      }
    });
  }
});


/*** receive delivery ***/
//todo:stocktake refactor it

Meteor.methods({
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