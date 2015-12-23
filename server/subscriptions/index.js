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
  subscribe: function (subscription) {
    updateSubscription(subscription, false);
  },
  unsubscribe: function (subscription) {
    updateSubscription(subscription, true);
  }
});

var updateSubscription = function (subscription, unsubscribeTrigger) {

  debugger;
  check(subscription, HospoHero.checkers.SubscriptionDocument);
  subscription.subscriber = subscription.subscriber || Meteor.userId();

  // Check existing of subscription
  var subscriptionExists = Subscriptions.findOne({
    subscriber: subscription.subscriber,
    type: subscription.type,
    'relations.areaId': HospoHero.getCurrentAreaId(subscription.subscriber)
  });

  if (unsubscribeTrigger) {
    // unsubscribe

    if (subscription.itemIds == 'all') {
      // delete subscription
      Subscriptions.remove({_id: subscriptionExists._id})
    } else {
      updateSubscriptionItems(subscriptionExists._id, subscription.itemIds, unsubscribeTrigger);
    }
  } else {
    // subscribe

    if (!subscriptionExists) {
      Subscriptions.insert(subscription);
    } else {
      updateSubscriptionItems(subscriptionExists._id, subscription.itemIds, subscriptionExists.type, unsubscribeTrigger);
    }
  }
};

var updateSubscriptionItems = function (subscriptionToUpdateId, itemIds, subscriptionType, unsubscribeTrigger) {
  if (itemIds == 'all') {
    itemIds = getItemIds(itemIds, subscriptionType);
  }

  var updateQuery = getUpdateQuery(itemIds, unsubscribeTrigger);
  Subscriptions.update({_id: subscriptionToUpdateId}, updateQuery);
  var res = Subscriptions.findOne({_id: subscriptionToUpdateId});
  console.log(res);
};

/**
 * Returns update query for subscription
 * @param {string|Array} itemIds - IDs of subscribed/unsubscribed items
 * @param {boolean} unsubscribeTrigger - If true - unsubscribes user from itemIds. Otherwise - subscribes on it
 */
var getUpdateQuery = function (itemIds, unsubscribeTrigger) {
  if (itemIds == 'all') {
    return {
      $set: {
        itemIds: 'all'
      }
    }
  }

  if (!_.isArray(itemIds)) {
    itemIds = [itemIds];
  }

  if (unsubscribeTrigger) {
    return {
      $pull: {
        itemIds: {$in: itemIds}
      }
    }
  } else {
    return {
      $push: {
        itemIds: {$each: itemIds}
      }
    }
  }
};


/**
 * Returns ID of items to subscribe/unsubscribe
 * @param {string} itemIds - Item ID or 'all'
 * @param {string} type - Type of subscription (menu|job)
 * @returns {string|Array}
 */
var getItemIds = function (itemIds, type) {
  var subscriptionCollections = {
    menu: MenuItems,
    job: JobItems
  };

  return subscriptionCollections[type].find({
    'relations.areaId': HospoHero.getCurrentAreaId(Meteor.userId())
  }).map(function (item) {
    return item._id;
  });
};
