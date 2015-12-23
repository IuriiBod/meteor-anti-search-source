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


var updateSubscription = function (subscriptionParams, unsubscribeTrigger) {
  check(subscriptionParams, HospoHero.checkers.SubscriptionDocument);
  subscriptionParams.subscriber = subscriptionParams.subscriber || Meteor.userId();

  if (subscriptionParams.itemIds != 'all' && !_.isArray(subscriptionParams.itemIds)) {
    subscriptionParams.itemIds = [subscriptionParams.itemIds];
  }

  // Check existing of subscription
  var existingSubscription = Subscriptions.findOne({
    subscriber: subscriptionParams.subscriber,
    type: subscriptionParams.type,
    'relations.areaId': HospoHero.getCurrentAreaId(subscriptionParams.subscriber)
  });

  if (unsubscribeTrigger) {
    // unsubscribe

    if (existingSubscription) {
      if (subscriptionParams.itemIds == 'all') {
        // delete subscription
        Subscriptions.remove({_id: existingSubscription._id});
      } else {
        removeItemsFromSubscription(existingSubscription, subscriptionParams.itemIds);
      }
    }

  } else {
    // subscribe

    if (!existingSubscription) {
      Subscriptions.insert(subscriptionParams);
    } else {
      addItemsToSubscription(existingSubscription, subscriptionParams.itemIds);
    }
  }
};

var removeItemsFromSubscription = function (existingSubscription, itemToRemoveIds) {
  if (existingSubscription.itemIds == 'all') {
    var allSubscribedItemIds = getItemIds(existingSubscription.type);
    allSubscribedItemIds = _.difference(allSubscribedItemIds, itemToRemoveIds);
    Subscriptions.update({_id: existingSubscription._id}, {$set: {itemIds: allSubscribedItemIds}});
  } else {
    Subscriptions.update({_id: existingSubscription._id}, {$pull: {itemIds: {$in: itemToRemoveIds}}});
  }
};

var addItemsToSubscription = function (existingSubscription, itemToAddIds) {
  if (existingSubscription.itemIds == 'all') {
    throw new Meteor.Error('This item already subscribed');
  } else {
    if (itemToAddIds == 'all') {
      Subscriptions.update({_id: existingSubscription._id}, {$set: {itemIds: 'all'}});
    } else {
      Subscriptions.update({_id: existingSubscription._id}, {$addToSet: {itemIds: {$each: itemToAddIds}}});
    }
  }
};

// Get all items ids for subscriptions for all items
var getItemIds = function (itemType) {
  var subscriptionCollections = {
    menu: MenuItems,
    job: JobItems
  };

  return subscriptionCollections[itemType].find({
    'relations.areaId': HospoHero.getCurrentAreaId(Meteor.userId())
  }).map(function (item) {
    return item._id;
  });
};
