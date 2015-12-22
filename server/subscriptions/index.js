Meteor.methods({
  /**
   * Subscribe or unsubscribe user from items
   *
   * @param {Object} subscription - The subscription parameters
   * @param {string} [subscription._id] - ID of subscription
   * @param {string} subscription.type - Type of subscription (menu|job)
   * @param {string} subscription.itemIds - 'all' or item ID
   * @param {string} subscription.subscriber - ID of subscriber
   * @param {Object} subscription.relations - HospoHero relations object
   * @param {boolean} unsubscribeTrigger - If true - unsubscribes user from itemIds. Otherwise - subscribes on it
   */
  subscribe: function (subscription, unsubscribeTrigger) {
    //check(subscription, HospoHero.checkers.SubscriptionDocument);

    var userId = subscription.subscriber || Meteor.userId();

    // Find what do we want to change
    var itemIds = getItemIds(subscription.itemIds, subscription.type);

    // Check existing of subscription
    var subscriptionExists = Subscriptions.findOne({
      subscriber: userId,
      type: subscription.type,
      'relations.areaId': HospoHero.getCurrentAreaId(userId)
    });

    if (!subscriptionExists) {
      if (_.isString(itemIds)) {
        itemIds = [itemIds];
      }
      subscription.itemIds = itemIds;
      Subscriptions.insert(subscription);
    } else {
      var updateQuery = getUpdateQuery(itemIds, unsubscribeTrigger);
      Subscriptions.update({_id: subscriptionExists._id}, updateQuery);
    }

  }
});

/**
 * Returns ID of items to subscribe/unsubscribe
 * @param {string} itemIds - Item ID or 'all'
 * @param {string} type - Type of subscription (menu|job)
 * @returns {string|Array}
 */
var getItemIds = function (itemIds, type) {
  if (itemIds === 'all') {
    var subscriptonCollections = {
      menu: MenuItems,
      job: JobItems
    };

    itemIds = subscriptonCollections[type].find({
      'relations.areaId': HospoHero.getCurrentAreaId(Meteor.userId())
    }).map(function (item) {
      return item._id;
    });
  }

  return itemIds;
};

/**
 * Returns update query for subscription
 * @param {string|Array} itemIds - IDs of subscribed/unsubscribed items
 * @param {boolean} unsubscribeTrigger - If true - unsubscribes user from itemIds. Otherwise - subscribes on it
 */
var getUpdateQuery = function (itemIds, unsubscribeTrigger) {
  var updateQuery = {};

  if (unsubscribeTrigger) {
    updateQuery.$pull = {
      itemIds: itemIds
    };
  } else {
    if (_.isArray(itemIds)) {
      updateQuery.$addToSet = {
        itemIds: {
          $each: itemIds
        }
      };
    } else {
      updateQuery.$addToSet = {
        itemIds: itemIds
      };
    }
  }
  return updateQuery;
};