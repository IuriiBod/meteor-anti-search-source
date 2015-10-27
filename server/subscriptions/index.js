Meteor.methods({
  /**
   * Subscribe or unsubscribe user from items
   *
   * @param {Object} subscription - The subscription parameters
   * @param {string} subscription.type - Type of subscription (menu|job)
   * @params {string} subscription.itemIds - 'all' or item ID
   * @param {boolean} unsubscribe - If true - unsubscribes user from itemIds. Otherwise - subscribes on it
   */
  subscribe: function (subscription, unsubscribe) {
    check(subscription, HospoHero.checkers.SubscriptionDocument);

    var userId = Meteor.userId();
    if (!HospoHero.getCurrentAreaId(userId)) {
      logger.error(403, 'User not permitted to subscribe on items');
    }

    var isAll = subscription.itemIds === 'all';

    /**
     * Returns query to update
     * @param {string} itemIdNew - 'all' or ID of item
     * @param {array} itemIdsOld - Array of subscribed item IDs
     * @param {boolean} unsubscribe - If true - delete itemIdNew from itemIdsOld
     * @returns {{itemIds: *}}
     */
    var getUpdateQuery = function (itemIdNew, itemIdsOld, unsubscribe) {
      if (unsubscribe && !all) {
        var itemIndex = itemIdsOld.indexOf(itemIdNew);
        if (itemIndex > -1) {
          itemIdsOld.splice(itemIndex, 1);
        }
      } else if (!unsubscribe) {
        isAll ? itemIdsOld = 'all' : itemIdsOld.push(itemIdNew);
      }
      return {itemIds: itemIdsOld};
    };

    var subscriptionExists = Subscriptions.findOne({
      subscriber: userId,
      type: subscription.type
    });

    if (subscriptionExists && unsubscribe && isAll) {
      Subscriptions.remove({_id: subscriptionExists._id});
    } else if(!subscriptionExists && !unsubscribe) {
      var defaultSubscription = {
        type: subscription.type,
        itemIds: isAll ? 'all' : [subscription.itemIds],
        subscriber: userId,
        relations: HospoHero.getRelationsObject()
      };
      Subscriptions.insert(defaultSubscription);
    } else {
      Subscriptions.update({
        _id: subscriptionExists._id
      }, {
        $set: getUpdateQuery(subscription.itemIds, subscriptionExists.itemIds, unsubscribe)
      });
    }
  }
});