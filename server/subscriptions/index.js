Meteor.methods({
  subscribe: function (subscription) {
    updateSubscription(subscription, false);
  },
  unsubscribe: function (subscription) {
    updateSubscription(subscription, true);
  }
});

/**
 * Subscribe or unsubscribe user from items
 *
 * @param {Object} subscriptionParams - The subscription parameters
 * @param {string} [subscriptionParams._id] - ID of subscription
 * @param {string} subscriptionParams.type - Type of subscription (menu|job)
 * @param {string} subscriptionParams.itemIds - 'all' or item ID
 * @param {string} subscriptionParams.subscriber - ID of subscriber
 * @param {Object} subscriptionParams.relations - HospoHero relations object
 * @param {boolean} unsubscribeTrigger - if true - do unsubscription
 */
var updateSubscription = function (subscriptionParams, unsubscribeTrigger) {
  /**
   * Remove certain items from subscription
   *
   * @param {Object} existingSubscription - Subscription object that will be updated
   * @param {Array} itemToRemoveIds - can be array with item id's, that should be removed from existing subscription
   */
  var removeItemsFromSubscription = function (existingSubscription, itemToRemoveIds) {
    /**
     * returns id's of items that can be included to subscription
     *
     * @param {String} itemType - Type of subscription. Can be 'job' or 'menu'
     */
    var getItemIdsForSubscription = function (itemType) {
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

    //// removeItemsFromSubscription implementation
    //
    if (existingSubscription.itemIds === 'all') {
      var allSubscribedItemIds = getItemIdsForSubscription(existingSubscription.type);
      var itemsWithoutUnsubscribed = _.difference(allSubscribedItemIds, itemToRemoveIds);
      Subscriptions.update({_id: existingSubscription._id}, {$set: {itemIds: itemsWithoutUnsubscribed}});
    } else if (existingSubscription.itemIds.length > 1) {
      Subscriptions.update({_id: existingSubscription._id}, {$pull: {itemIds: {$in: itemToRemoveIds}}});
    } else {
      Subscriptions.remove({_id: existingSubscription._id});
    }
  };
  /**
   * Add certain items(or all) from subscription
   *
   * @param {Object} existingSubscription - Subscription object that will be updated
   * @param {Array|String} itemToRemoveIds - array with items id's, that should be added to existing subscription
   */
  var addItemsToSubscription = function (existingSubscription, itemToAddIds) {
    if (existingSubscription.itemIds === 'all') {
      throw new Meteor.Error('This item already subscribed');
    } else {
      if (itemToAddIds === 'all') {
        Subscriptions.update({_id: existingSubscription._id}, {$set: {itemIds: 'all'}});
      } else {
        Subscriptions.update({_id: existingSubscription._id}, {$addToSet: {itemIds: {$each: itemToAddIds}}});
      }
    }
  };

  //// Start of updateSubscription implementation
  //
  check(subscriptionParams, HospoHero.checkers.SubscriptionDocument);
  subscriptionParams.subscriber = subscriptionParams.subscriber || Meteor.userId();

  if (subscriptionParams.itemIds !== 'all' && !_.isArray(subscriptionParams.itemIds)) {
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
      if (subscriptionParams.itemIds === 'all') {
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
