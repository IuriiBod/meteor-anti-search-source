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
  },

  countOfNeededOrderItems: function (orderItem) {
    //calculation of optimal delivery interval
    const averageDaysInMonth = 30;
    const supplierId = Ingredients.findOne(orderItem.ingredient.id).suppliers;
    const deliveryCountPerMonth = Suppliers.findOne(supplierId).deliveryDays.length * 4;
    const ingredientExpireDays = 5; //an approximate average value
    const minimalDeliveryIntervalDays = Math.floor(averageDaysInMonth / deliveryCountPerMonth);
    const expireImpact = Math.floor(ingredientExpireDays / minimalDeliveryIntervalDays);
    const expireImpactCoefficient = expireImpact > 1 ? 1 / expireImpact : 1;
    const optimalDeliveryIntervalDays = Math.ceil(
        averageDaysInMonth / (deliveryCountPerMonth * expireImpactCoefficient));

    //calculation of sales interval
    const order = Orders.findOne(orderItem.orderId);
    const salesInterval = TimeRangeQueryBuilder.forInterval(
        moment(order.createdAt).startOf('day'),
        moment(order.createdAt).startOf('day').add(optimalDeliveryIntervalDays, 'days')
    );


    //calculation quantity sales of ingredient
    let ingredientExpectedQuantity = 0;

    let getCountSalesOfMenuItem = (menuItem) => {
      const salesCountArr = DailySales.find({
        menuItemId: menuItem._id,
        date: salesInterval,
        predictionQuantity: {$exists: true}
      }).map(dailySale => dailySale.predictionQuantity);

      return salesCountArr.reduce((sum, current) => sum + current, 0);
    };

    const menuItemsWithIngredient = MenuItems.find({
      'ingredients._id': orderItem.ingredient.id
    }, {
      fields: {
        ingredients: {$elemMatch: {_id: orderItem.ingredient.id}}
      }
    });

    if (menuItemsWithIngredient.count() === 0) {
      return '-';
    } else {
      menuItemsWithIngredient.forEach((menuItem) => {
        const menuItemIngredient = menuItem.ingredients[0];
        ingredientExpectedQuantity += getCountSalesOfMenuItem(menuItem) * menuItemIngredient.quantity;

      });
    }

    //calculation of portions of needed ingredient
    const ingredient = Ingredients.findOne(orderItem.ingredient.id);
    const neededIngredientExpectedCount = Math.floor(ingredientExpectedQuantity / ingredient.unitSize);

    const stockItem = StockItems.findOne({
      stocktakeId: order.stocktakeId,
      'ingredient.id': orderItem.ingredient.id
    });

    const ingredientNeededCount = neededIngredientExpectedCount - stockItem.count;

    return ingredientNeededCount > 0 ? ingredientNeededCount : 0;
  }
});